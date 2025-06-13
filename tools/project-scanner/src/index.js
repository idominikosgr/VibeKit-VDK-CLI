#!/usr/bin/env node

/**
 * VibeCoding Project Scanner
 * Main entry point for the project scanner utility.
 * 
 * This utility analyzes a codebase to generate custom VibeCodingRules tailored to the project.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import { ProjectScanner } from './core/ProjectScanner.js';
import { PatternDetector } from './core/PatternDetector.js';
import { TechnologyAnalyzer } from './core/TechnologyAnalyzer.js'; // Using our updated version
import { RuleGenerator } from './core/RuleGenerator.js';
import { RuleValidator } from './utils/validator.js';
import { IDEIntegrationManager } from './integrations/ide-integration.js';
import { getVersion } from './utils/version.js';
import { GitIgnoreParser } from './utils/gitignore-parser.js'; // Import our new GitIgnore parser

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Greeting banner
const displayBanner = () => {
  console.log(chalk.cyan('\n============================================='));
  console.log(chalk.cyan(`  🔍 VibeCoding Project Scanner v${getVersion()}`));
  console.log(chalk.cyan('  Intelligent rule generation for AI assistance'));
  console.log(chalk.cyan('=============================================\n'));
};

const program = new Command();

program
  .name('vibe-coding-rules-scanner')
  .description('Analyzes project structure and patterns to generate custom Vibe Coding Rules')
  .version(getVersion())
  .option('-p, --path <path>', 'Path to the project to scan', process.cwd())
  .option('-o, --output <path>', 'Path where generated rules should be saved', './.ai/rules')
  .option('-d, --deep', 'Enable deep scanning for more thorough pattern detection', false)
  .option('-i, --ignorePattern <patterns...>', 'Glob patterns to ignore', ['**/node_modules/**', '**/dist/**', '**/build/**'])
  .option('--use-gitignore', 'Automatically parse .gitignore files for additional ignore patterns', true) // New option
  .option('-v, --verbose', 'Enable verbose output for debugging', false)
  .option('--skip-validation', 'Skip validation of generated rule files', false)
  .option('--strict', 'Enable strict mode for rule validation', false)
  .option('--templates <templates>', 'Comma-separated list of templates to use', 'project-context')
  .option('--watch', 'Watch for file changes and regenerate rules', false)
  .option('--ide-integration', 'Set up IDE integration', false);

program.parse(process.argv);
const options = program.opts();

async function run() {
  displayBanner();
  
  // Normalize paths
  const projectPath = path.resolve(options.path);
  const outputPath = path.resolve(options.output);
  
  try {
    // Prepare spinner for showing progress
    const spinner = ora('Initializing scanner...').start();
    
    // Create scanner components
    const scanner = new ProjectScanner({
      verbose: options.verbose
    });
    
    const patternDetector = new PatternDetector({
      verbose: options.verbose
    });
    
    const techAnalyzer = new TechnologyAnalyzer({
      verbose: options.verbose
    });
    
    const ruleGenerator = new RuleGenerator({
      templatesDir: path.join(__dirname, 'templates'),
      verbose: options.verbose
    });
    
    spinner.succeed('Scanner components initialized');
    
    // Get base ignore patterns
    let ignorePatterns = options.ignorePattern || [];
    
    // Parse .gitignore if enabled
    if (options.useGitignore) {
      spinner.text = 'Parsing .gitignore for additional ignore patterns...';
      const gitignorePatterns = await GitIgnoreParser.parseGitIgnore(projectPath);
      
      if (gitignorePatterns.length > 0) {
        ignorePatterns = [...ignorePatterns, ...gitignorePatterns];
        if (options.verbose) {
          console.log(chalk.gray(`Added ${gitignorePatterns.length} patterns from .gitignore`));
        }
      }
      
      // Always ignore .git directory
      ignorePatterns.push('**/.git/**');
      
      // Always ignore TypeScript declaration files
      ignorePatterns.push('**/*.d.ts');
      
      // Always ignore Next.js build output
      ignorePatterns.push('**/.next/**');
    }
    
    // Scan project structure
    spinner.text = 'Scanning project structure...';
    const projectStructure = await scanner.scanProject(projectPath, { 
      ignorePatterns,
      deep: options.deep 
    });
    
    spinner.succeed(`Project structure scanned (${projectStructure.files.length} files in ${projectStructure.directories.length} directories)`);
    
    // Detect code patterns
    spinner.text = 'Detecting code patterns and conventions...';
    const patterns = await patternDetector.detectPatterns(projectStructure);
    spinner.succeed('Code patterns and conventions detected');
    
    // Analyze technology stack
    spinner.text = 'Identifying technology stack...';
    const techStack = await techAnalyzer.analyzeTechnologies(projectStructure);
    
    // Log detected technologies
    const technologies = techStack.primaryLanguages.join(', ');
    spinner.succeed(`Technology stack identified: ${technologies}`);
    
    // Generate rule files
    spinner.text = 'Generating rule files...';
    
    // Parse templates option (comma-separated list)
    const templates = options.templates.split(',').map(t => t.trim());
    
    const { generatedFiles } = await ruleGenerator.generateRules({
      outputPath,
      projectPath,
      projectName: path.basename(projectPath),
      templates,
      patterns,
      techStack
    });
    
    spinner.succeed(`Rule files generated at ${outputPath}`);
    
    // Validate generated rule files
    if (!options.skipValidation) {
      spinner.text = 'Validating generated rule files...';
      
      const validator = new RuleValidator({
        strictMode: options.strict,
        verbose: options.verbose
      });
      
      const validationResults = await validator.validateRuleDirectory(outputPath);
      
      if (validationResults && validationResults.warnings && validationResults.warnings.length > 0) {
        console.log('\n' + chalk.yellow('Warnings:'));
        validationResults.warnings.forEach(warning => {
          console.log(chalk.yellow(`⚠️ ${warning.file}: ${warning.message || JSON.stringify(warning)}`));
        });
      }
      
      if (validationResults && validationResults.errors && validationResults.errors.length > 0) {
        console.log('\n' + chalk.red('Errors:'));
        validationResults.errors.forEach(error => {
          console.log(chalk.red(`❌ ${error.file}: ${error.message || JSON.stringify(error)}`));
        });
      }

      // Log validation rate
      if (validationResults && typeof validationResults.validRules !== 'undefined' && typeof validationResults.totalRules !== 'undefined') {
        const validationRate = validationResults.totalRules > 0 ? 
          (validationResults.validRules / validationResults.totalRules * 100).toFixed(1) : '0';
        if (validationRate >= 80) {
          spinner.succeed(`Rule validation passed: ${validationRate}% of rules are valid`);
        } else {
          spinner.fail(`Rule validation failed: ${validationRate}% of rules are valid`);
        }
      } else {
        spinner.warn('Rule validation skipped: Could not calculate validation rate');
      }
    }
    
    // Set up IDE integration if enabled
    if (options.ideIntegration) {
      spinner.text = 'Setting up IDE integration...';
      
      try {
        const ideIntegration = new IDEIntegrationManager({
          projectPath,
          rulesDir: outputPath,
          verbose: options.verbose
        });
        
        const integrations = await ideIntegration.initialize(projectPath);
        spinner.succeed(`IDE integrations initialized: ${integrations.join(', ')}`);
        
        // If in watch mode, keep the process running
        if (options.watch) {
          console.log(chalk.blue('\nWatch mode enabled. Press Ctrl+C to exit.'));
          
          // Handle process termination
          process.on('SIGINT', () => {
            console.log(chalk.yellow('\nShutting down...'));
            if (ideIntegration) {
              ideIntegration.shutdown();
            }
            process.exit(0);
          });
          
          // Keep the process running
          setInterval(() => {}, 1000);
          
          // Don't continue to the success message in watch mode
          return;
        }
      } catch (error) {
        spinner.fail(`IDE integration setup failed: ${error.message}`);
        if (options.verbose) {
          console.error(chalk.red(error.stack));
        }
      }
    }
    
    console.log('\n' + chalk.green('✅ Project scanning completed successfully!'));
    console.log(chalk.green('Generated rule files:'));
    if (generatedFiles && Array.isArray(generatedFiles)) {
      generatedFiles.forEach(file => {
        console.log(chalk.green(`- ${file}`));
      });
    } else {
      console.log(chalk.green(`- Rules saved to ${outputPath}`));
    }
    
    console.log('\n' + chalk.cyan('Next steps:'));
    console.log(chalk.cyan('1. Review the generated rules in your editor'));
    console.log(chalk.cyan('2. Customize any specific details as needed'));
    console.log(chalk.cyan('3. Activate the rules in your AI assistant\n'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ An error occurred during scanning:'));
    console.error(chalk.red(error.message));
    if (options.verbose && error.stack) {
      console.error(chalk.gray('\nStack trace:'));
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

run().catch(error => {
  console.error(chalk.red('\n❌ Unhandled exception:'));
  console.error(chalk.red(error.message));
  if (options.verbose && error.stack) {
    console.error(chalk.gray('\nStack trace:'));
    console.error(chalk.gray(error.stack));
  }
  process.exit(1);
});
