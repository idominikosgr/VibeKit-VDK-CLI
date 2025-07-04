#!/usr/bin/env node

/**
 * VibeKit VDK Setup Wizard
 * -----------------------
 * This interactive script helps configure VibeKit VDK for your development project.
 * It creates a custom rule structure based on your selected IDE/tools, frameworks,
 * languages, and technologies.
 *
 * Repository: https://github.com/idominikosgr/VibeKit-VDK-CLI
 */

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import ora from 'ora';
import { fileURLToPath } from 'url';

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup colors for CLI
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

/**
 * Check if a directory appears to be a valid project directory
 * @param {string} dirPath - Path to check
 * @returns {Object} - { isProject: boolean, indicators: string[] }
 */
function validateProjectDirectory(dirPath) {
  const indicators = [];
  const projectFiles = [
    'package.json',       // Node.js/JavaScript projects
    'requirements.txt',   // Python projects
    'Cargo.toml',        // Rust projects
    'go.mod',            // Go projects
    'pom.xml',           // Java Maven projects
    'build.gradle',      // Java Gradle projects
    'Gemfile',           // Ruby projects
    'composer.json',     // PHP projects
    'pubspec.yaml',      // Dart/Flutter projects
    'Project.swift',     // Swift projects
    'CMakeLists.txt',    // C/C++ projects
    '.csproj',           // C# projects
    'mix.exs',           // Elixir projects
    'deno.json',         // Deno projects
    'pyproject.toml',    // Modern Python projects
  ];

  const projectDirs = [
    '.git',              // Git repository
    '.svn',              // SVN repository
    '.hg',               // Mercurial repository
    'node_modules',      // Node.js dependencies
    '.venv',             // Python virtual environment
    'venv',              // Python virtual environment
    'target',            // Rust/Java build directory
    'build',             // Common build directory
  ];

  // Check for project files
  for (const file of projectFiles) {
    if (file.endsWith('.csproj')) {
      // Special case for .csproj files - check for any .csproj file
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.csproj'));
      if (files.length > 0) {
        indicators.push(`${files[0]} (C# project)`);
      }
    } else {
      const filePath = path.join(dirPath, file);
      if (fs.existsSync(filePath)) {
        indicators.push(file);
      }
    }
  }

  // Check for project directories
  for (const dir of projectDirs) {
    const dirFullPath = path.join(dirPath, dir);
    if (fs.existsSync(dirFullPath) && fs.statSync(dirFullPath).isDirectory()) {
      indicators.push(`${dir}/ (directory)`);
    }
  }

  return {
    isProject: indicators.length > 0,
    indicators
  };
}

/**
 * Parse command line arguments
 * @returns {Object} - Parsed arguments
 */
function parseArguments() {
  const args = process.argv.slice(2);
  const parsed = {
    targetDir: null,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--target-dir' && i + 1 < args.length) {
      parsed.targetDir = args[i + 1];
      i++; // Skip next argument as it's the value
    } else if (arg.startsWith('--target-dir=')) {
      parsed.targetDir = arg.split('=')[1];
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    }
  }

  return parsed;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
${colors.bright}${colors.cyan}VibeKit VDK CLI Setup Wizard${colors.reset}

${colors.bright}Usage:${colors.reset}
  node cli.js [options]

${colors.bright}Options:${colors.reset}
  --target-dir <path>   Target directory for installation (default: current directory)
  --help, -h           Show this help message

${colors.bright}Examples:${colors.reset}
  node cli.js                           # Install in current directory
  node cli.js --target-dir /path/to/my-project
  node cli.js --target-dir=~/my-project
`);
}

/**
 * Import the centralized IDE configuration from the shared module
 * This ensures consistency between setup-wizard and project-scanner
 */
import * as ideConfig from './src/shared/ide-configuration.js';

/**
 * Import the editor path resolver for managing MCP configuration
 */
import * as editorPathResolver from './src/shared/editor-path-resolver.js';

/**
 * Import the sync functionality for remote rule management
 */
import * as ruleSync from './src/sync/rule-sync.js';

/**
 * Available IDE/Tool options with their corresponding directory structures
 * Each IDE/tool will store rules in a specific directory structure that works best with its integration
 * This is now derived from the centralized configuration
 */
const ideTools = ideConfig.getIDEOptionsForWizard();

/**
 * Available technology frameworks to choose from
 * Each framework will enable specific rule files
 */
const frameworks = [
  { name: 'React', folder: 'React-Modern', description: 'Modern React with hooks and functional components' },
  { name: 'Next.js', folder: 'NextJS-Comprehensive', description: 'Next.js with App Router and React Server Components' },
  { name: 'Vue.js', folder: 'Vue-Modern', description: 'Vue 3 with Composition API' },
  { name: 'Angular', folder: 'Angular-Modern', description: 'Modern Angular with best practices' },
  { name: 'Svelte', folder: 'Svelte', description: 'Svelte with runes and component patterns' },
  { name: 'Express.js', folder: 'Node-Express', description: 'Node.js Express with structured routing' },
  { name: 'NestJS', folder: 'NestJS', description: 'NestJS framework for scalable server-side applications' },
  { name: 'Django', folder: 'Django-Modern', description: 'Django with modern Python features' },
  { name: 'Flask', folder: 'Flask', description: 'Python Flask for lightweight web applications' },
  { name: 'FastAPI', folder: 'FastAPI', description: 'Python FastAPI with type hints' },
  { name: 'Flutter', folder: 'Flutter', description: 'Flutter for cross-platform app development' },
  { name: 'SwiftUI', folder: 'SwiftUI', description: 'Modern SwiftUI with NavigationStack patterns' },
  { name: 'React Native', folder: 'ReactNative-Mobile', description: 'React Native for mobile app development' },
  { name: 'None/Other', folder: 'Generic-Framework', description: 'Skip framework-specific rules' }
];

/**
 * Available programming languages to choose from
 * Each language will enable specific rule files
 */
const languages = [
  { name: 'TypeScript', folder: 'TypeScript-Modern', description: 'Modern TypeScript with functional programming patterns' },
  { name: 'JavaScript', folder: 'JavaScript', description: 'JavaScript with modern ES features' },
  { name: 'Python', folder: 'Python3', description: 'Python 3 with typing and modern patterns' },
  { name: 'Java', folder: 'Java', description: 'Java with modern language features' },
  { name: 'C#', folder: 'CSharp', description: 'C# with .NET Core and modern patterns' },
  { name: 'Go', folder: 'Go', description: 'Go with idiomatic patterns' },
  { name: 'Ruby', folder: 'Ruby', description: 'Ruby with modern language features' },
  { name: 'PHP', folder: 'PHP', description: 'PHP with modern language features' },
  { name: 'Swift', folder: 'Swift', description: 'Swift 5.9/6.0 with macros and concurrency' },
  { name: 'Kotlin', folder: 'Kotlin', description: 'Kotlin for Android and server-side' },
  { name: 'Rust', folder: 'Rust', description: 'Rust with memory safety patterns' },
  { name: 'C++', folder: 'CPP20', description: 'Modern C++ with C++20 features' },
  { name: 'Other', folder: 'Generic-Language', description: 'Skip language-specific rules' }
];

/**
 * Available technology stacks to choose from
 * Each stack represents a combination of technologies that work well together
 */
const stacks = [
  { name: 'NextJS Enterprise Stack', folder: 'NextJS-Enterprise-Stack', description: 'Enterprise-grade Next.js setup' },
  { name: 'Supabase + Next.js', folder: 'Supabase-NextJS-Stack', description: 'Next.js with Supabase backend' },
  { name: 'tRPC Full-Stack', folder: 'TRPC-FullStack', description: 'End-to-end typesafe APIs with tRPC' },
  { name: 'MERN Stack', folder: 'MERN-Stack', description: 'MongoDB, Express, React, Node.js' },
  { name: 'MEAN Stack', folder: 'MEAN-Stack', description: 'MongoDB, Express, Angular, Node.js' },
  { name: 'Laravel + Vue', folder: 'Laravel-Vue-Stack', description: 'Laravel backend with Vue frontend' },
  { name: 'Django REST + React', folder: 'Django-React-Stack', description: 'Django REST Framework with React' },
  { name: 'Spring Boot + React', folder: 'Spring-React-Stack', description: 'Spring Boot backend with React frontend' },
  { name: 'Astro Content Stack', folder: 'Astro-Content-Stack', description: 'Astro with content-focused approach' },
  { name: 'Ecommerce Stack', folder: 'Ecommerce-Stack', description: 'Full e-commerce solution' },
  { name: 'React Native Mobile', folder: 'ReactNative-Mobile-Stack', description: 'React Native with mobile best practices' },
  { name: 'None/Other', folder: 'Generic-Stack', description: 'Skip stack-specific rules' }
];

/**
 * Available additional technologies to choose from
 * Multiple technologies can be selected to enable specific rule files
 */
const technologies = [
  { name: 'Tailwind CSS', folder: 'TailwindCSS', description: 'Utility-first CSS framework' },
  { name: 'Redux', folder: 'Redux-Modern', description: 'Modern Redux with toolkit pattern' },
  { name: 'GraphQL', folder: 'GraphQL', description: 'GraphQL API development' },
  { name: 'Prisma', folder: 'Prisma', description: 'Next-generation ORM for Node.js' },
  { name: 'PostgreSQL', folder: 'PostgreSQL', description: 'PostgreSQL database integration' },
  { name: 'MongoDB', folder: 'MongoDB', description: 'MongoDB database integration' },
  { name: 'Docker', folder: 'Docker', description: 'Docker containerization' },
  { name: 'AWS', folder: 'AWS', description: 'AWS cloud services integration' },
  { name: 'Firebase', folder: 'Firebase', description: 'Firebase backend services' },
  { name: 'shadcn/ui', folder: 'ShadcnUI', description: 'Component library using Tailwind CSS' },
  { name: 'Agentic AI', folder: 'Agentic-AI-Development', description: 'AI agents for development assistance' },
  { name: 'MCP Servers', folder: 'MCP-Integration', description: 'Multi-context processing integration' },
  { name: 'Sequential Thinking', folder: 'Sequential-Thinking-Advanced', description: 'Advanced sequential reasoning patterns' },
  { name: 'Memory Management', folder: 'Memory-Management', description: 'Patterns for memory and state management' }
];

/**
 * AI assistant tools that can be enabled
 * These provide specific capabilities or workflows
 */
const tools = [
  { name: 'AI Code Review', folder: 'AI-Code-Review', description: 'Automated code review with AI' },
  { name: 'AI Pair Programming', folder: 'AI-Pair-Programming', description: 'Collaborative coding assistance' },
  { name: 'Memory Handoff', folder: 'AI-Session-Handoff', description: 'Persistent context between sessions' },
  { name: 'AI Refactoring', folder: 'AI-Refactoring', description: 'Intelligent code refactoring' },
  { name: 'API Development', folder: 'API-Endpoints', description: 'Tools for API design and implementation' },
  { name: 'Performance Optimization', folder: 'Optimize-Performance', description: 'Code optimization guidance' },
  { name: 'Task Breakdown', folder: 'Task-Breakdown', description: 'Decompose complex tasks into steps' },
  { name: 'Write Tests', folder: 'Write-Tests', description: 'Generate test suites for code' }
];

// User selections
const userSelections = {
  projectPath: null, // Will be set based on arguments or user input
  ideTool: null,
  ideToolName: null,
  framework: null,
  language: null,
  stack: null,
  technologies: [],
  tools: [],
  verbose: false,
  setupMode: 'automatic',
  syncRules: false
};

/**
 * Select the IDE or tool to use for AI-assisted development
 * This will determine where rule files are stored and how they're structured
 * Enhanced with automatic IDE detection and prioritization of detected IDEs
 */
async function selectIDETool() {
  console.log(`\n${colors.bright}${colors.cyan}Step 1: Select your IDE or AI Tool${colors.reset}`);
  console.log('This determines where the rules will be stored and how they integrate with your AI assistant.');

  // Detect IDEs in the current project directory
  const detectedIDEs = ideConfig.detectIDEs(userSelections.projectPath);

  if (detectedIDEs.length > 0) {
    console.log(`\n${colors.bright}${colors.green}Detected IDE configurations:${colors.reset}`);
    detectedIDEs.forEach((ide) => {
      console.log(`${colors.green}• ${ide.name}${colors.reset} (${ide.configFolder})`);
    });
    console.log('');
  }

  // Use inquirer for a more user-friendly selection interface
  const ideChoices = ideTools.map(tool => {
    const isDetected = detectedIDEs.some(ide => ide.id === tool.id);
    return {
      name: `${tool.name}${isDetected ? ` ${colors.green}(detected)${colors.reset}` : ''} - ${tool.description}`,
      value: tool.id,
      short: tool.name
    };
  });

  // Find the default selection (first detected IDE, or first option if none detected)
  let defaultSelection = 'generic';
  if (detectedIDEs.length > 0) {
    const detectedTool = ideTools.find(tool => tool.id === detectedIDEs[0].id);
    if (detectedTool) {
      defaultSelection = detectedTool.id;
    }
  }

  const { ideTool } = await inquirer.prompt([{
    type: 'list',
    name: 'ideTool',
    message: 'Select the IDE or tool you\'re using:',
    choices: ideChoices,
    default: defaultSelection,
    pageSize: 10
  }]);

  // Store the selection
  userSelections.ideTool = ideTool;
  const selectedIDE = ideConfig.getIDEConfigById(ideTool);
  userSelections.ideToolName = selectedIDE ? selectedIDE.name : 'Unknown IDE';

  console.log(`${colors.green}✓${colors.reset} Selected: ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
  console.log(`  Rules will be installed in ${colors.cyan}${selectedIDE.rulesFolder}${colors.reset}`);

  return Promise.resolve();
}

// Function to select a framework
async function selectFramework() {
  console.log(`\n${colors.bright}${colors.cyan}Step 2: Select your framework:${colors.reset}`);
  console.log('This determines which framework-specific patterns and best practices will be applied.');

  const { framework } = await inquirer.prompt([{
    type: 'list',
    name: 'framework',
    message: 'Select your primary framework:',
    choices: frameworks.map(f => ({
      name: `${f.name} - ${f.description}`,
      value: f
    })),
    pageSize: 10
  }]);

  userSelections.framework = framework;
  console.log(`${colors.green}✓${colors.reset} Selected: ${colors.cyan}${framework.name}${colors.reset}`);

  return Promise.resolve();
}

// Function to select a language
async function selectLanguage() {
  console.log(`\n${colors.bright}${colors.cyan}Step 3: Select your primary language:${colors.reset}`);
  console.log('This determines which language-specific patterns and best practices will be applied.');

  const { language } = await inquirer.prompt([{
    type: 'list',
    name: 'language',
    message: 'Select your primary programming language:',
    choices: languages.map(l => ({
      name: `${l.name} - ${l.description}`,
      value: l
    })),
    pageSize: 10
  }]);

  userSelections.language = language;
  console.log(`${colors.green}✓${colors.reset} Selected: ${colors.cyan}${language.name}${colors.reset}`);

  return Promise.resolve();
}

// Function to select a stack
async function selectStack() {
  console.log(`\n${colors.bright}${colors.cyan}Step 4: Select your project stack (optional):${colors.reset}`);
  console.log('This determines which pre-configured stack templates will be applied.');

  const { stack } = await inquirer.prompt([{
    type: 'list',
    name: 'stack',
    message: 'Select your project stack:',
    choices: [
      ...stacks.map(s => ({
        name: `${s.name} - ${s.description}`,
        value: s
      })),
      { name: 'Skip this step', value: null }
    ],
    pageSize: 10
  }]);

  userSelections.stack = stack;
  if (stack) {
    console.log(`${colors.green}✓${colors.reset} Selected: ${colors.cyan}${stack.name}${colors.reset}`);
  } else {
    console.log(`${colors.yellow}→${colors.reset} Skipped stack selection.`);
  }

  return Promise.resolve();
}

// Function to select technologies
async function selectTechnologies() {
  console.log(`\n${colors.bright}${colors.cyan}Step 5: Select additional technologies:${colors.reset}`);
  console.log('Multiple selections allowed. These determine which technology-specific patterns will be applied.');

  const { selectedTechs } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selectedTechs',
    message: 'Select additional technologies (use space to select, enter to confirm):',
    choices: technologies.map(t => ({
      name: `${t.name} - ${t.description}`,
      value: t
    })),
    pageSize: 10
  }]);

  userSelections.technologies = selectedTechs || [];

  if (selectedTechs && selectedTechs.length > 0) {
    console.log(`${colors.green}✓${colors.reset} Selected ${selectedTechs.length} technologies:`);
    selectedTechs.forEach(tech => {
      console.log(`  • ${colors.cyan}${tech.name}${colors.reset}`);
    });
  } else {
    console.log(`${colors.yellow}→${colors.reset} No additional technologies selected.`);
  }

  return Promise.resolve();
}

// Function to select tools/tasks
async function selectTools() {
  console.log(`\n${colors.bright}${colors.cyan}Step 6: Select AI assistant tools:${colors.reset}`);
  console.log('Multiple selections allowed. These determine which AI assistant capabilities will be enabled.');

  const { selectedTools } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selectedTools',
    message: 'Select AI assistant tools (use space to select, enter to confirm):',
    choices: tools.map(t => ({
      name: `${t.name} - ${t.description}`,
      value: t
    })),
    pageSize: 10
  }]);

  userSelections.tools = selectedTools || [];

  if (selectedTools && selectedTools.length > 0) {
    console.log(`${colors.green}✓${colors.reset} Selected ${selectedTools.length} tools:`);
    selectedTools.forEach(tool => {
      console.log(`  • ${colors.cyan}${tool.name}${colors.reset}`);
    });
  } else {
    console.log(`${colors.yellow}→${colors.reset} No AI assistant tools selected.`);
  }

  return Promise.resolve();
}

// Function to confirm the selections
async function confirmSelections() {
  console.log(`\n${colors.bright}${colors.magenta}Review your selections:${colors.reset}`);
  console.log(`IDE/Tool: ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
  console.log(`Framework: ${colors.cyan}${userSelections.framework ? userSelections.framework.name : 'None'}${colors.reset}`);
  console.log(`Language: ${colors.cyan}${userSelections.language ? userSelections.language.name : 'None'}${colors.reset}`);
  console.log(`Stack: ${colors.cyan}${userSelections.stack ? userSelections.stack.name : 'None'}${colors.reset}`);

  console.log(`\nTechnologies:`);
  if (userSelections.technologies.length === 0) {
    console.log(`  ${colors.yellow}None${colors.reset}`);
  } else {
    userSelections.technologies.forEach(tech => {
      console.log(`  • ${colors.cyan}${tech.name}${colors.reset}`);
    });
  }

  console.log(`\nAI Assistant Tools:`);
  if (userSelections.tools.length === 0) {
    console.log(`  ${colors.yellow}None${colors.reset}`);
  } else {
    userSelections.tools.forEach(tool => {
      console.log(`  • ${colors.cyan}${tool.name}${colors.reset}`);
    });
  }

  const { confirmed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmed',
    message: 'Is this configuration correct?',
    default: true
  }]);

  return confirmed;
}

/**
 * Copy rule files based on selected IDE and technology choices
 * Enhanced to handle assistant-specific rule files and improved error handling
 */
async function copyRuleFiles() {
  console.log(`\n${colors.bright}${colors.blue}Setting up rules for ${colors.cyan}${userSelections.ideToolName}${colors.blue}...${colors.reset}`);

  try {
    // Get the target directory path based on the selected IDE
    const ideTool = userSelections.ideTool;
    const targetDir = ideConfig.ensureRuleDirectory(ideTool, userSelections.projectPath);
    console.log(`${colors.green}✓${colors.reset} Created rule directory: ${colors.cyan}${targetDir}${colors.reset}`);

    // First, try using the project scanner for automatic setup if that mode was selected
    if (userSelections.setupMode === 'automatic' || userSelections.setupMode === 'hybrid') {
      try {
        const scannerSuccess = await createRuleFilesFromScanner(targetDir);
        if (scannerSuccess && userSelections.setupMode === 'automatic') {
          return true;
        }
      } catch (error) {
        console.log(`${colors.yellow}→${colors.reset} Project scanner unavailable or failed. Using template-based setup.`);
      }
    }

    // Fall back to template-based rule generation
    await createRuleFilesFromTemplates(targetDir);

    // Create directories if they don't exist
    const directories = [
      path.join(targetDir, 'languages'),
      path.join(targetDir, 'technologies'),
      path.join(targetDir, 'stacks'),
      path.join(targetDir, 'tasks'),
      path.join(targetDir, 'assistants'),
      path.join(targetDir, 'tools'),
      path.join(targetDir, 'ai-tools')
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Copy selected rule files
    await copyLanguageRules(targetDir);
    await copyFrameworkRules(targetDir);
    await copyStackRules(targetDir);
    await copyTechnologyRules(targetDir);
    await copyToolRules(targetDir);

    // Update MCP configuration
    await updateMCPConfiguration(targetDir);

    console.log(`\n${colors.green}✓${colors.reset} Setup complete! Rules have been installed for ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error during rule file setup:${colors.reset} ${error.message}`);
    return false;
  }
}

// Helper function to copy language rules
async function copyLanguageRules(targetDir) {
  if (!userSelections.language || !userSelections.language.folder) {
    return;
  }

  const templateDir = path.join(__dirname, 'templates', 'languages');
  const langSource = path.join(templateDir, `${userSelections.language.folder}.mdc`);
  const langTarget = path.join(targetDir, 'languages', `${userSelections.language.folder}.mdc`);

  if (fs.existsSync(langSource)) {
    fs.copyFileSync(langSource, langTarget);
    console.log(`${colors.green}✓${colors.reset} Copied ${userSelections.language.name} language rules`);
  } else {
    console.log(`${colors.yellow}→${colors.reset} No template found for ${userSelections.language.name}`);
  }
}

// Helper function to copy framework rules
async function copyFrameworkRules(targetDir) {
  if (!userSelections.framework || !userSelections.framework.folder) {
    return;
  }

  const templateDir = path.join(__dirname, 'templates', 'technologies');
  const frameworkSource = path.join(templateDir, `${userSelections.framework.folder}.mdc`);
  const frameworkTarget = path.join(targetDir, 'technologies', `${userSelections.framework.folder}.mdc`);

  if (fs.existsSync(frameworkSource)) {
    fs.copyFileSync(frameworkSource, frameworkTarget);
    console.log(`${colors.green}✓${colors.reset} Copied ${userSelections.framework.name} framework rules`);
  } else {
    console.log(`${colors.yellow}→${colors.reset} No template found for ${userSelections.framework.name}`);
  }
}

// Helper function to copy stack rules
async function copyStackRules(targetDir) {
  if (!userSelections.stack || !userSelections.stack.folder) {
    return;
  }

  const templateDir = path.join(__dirname, 'templates', 'stacks');
  const stackSource = path.join(templateDir, `${userSelections.stack.folder}.mdc`);
  const stackTarget = path.join(targetDir, 'stacks', `${userSelections.stack.folder}.mdc`);

  if (fs.existsSync(stackSource)) {
    fs.copyFileSync(stackSource, stackTarget);
    console.log(`${colors.green}✓${colors.reset} Copied ${userSelections.stack.name} stack rules`);
  } else {
    console.log(`${colors.yellow}→${colors.reset} No template found for ${userSelections.stack.name}`);
  }
}

// Helper function to copy technology rules
async function copyTechnologyRules(targetDir) {
  if (!userSelections.technologies || userSelections.technologies.length === 0) {
    return;
  }

  const templateDir = path.join(__dirname, 'templates', 'technologies');

  for (const tech of userSelections.technologies) {
    if (tech.folder) {
      const techSource = path.join(templateDir, `${tech.folder}.mdc`);
      const techTarget = path.join(targetDir, 'technologies', `${tech.folder}.mdc`);

      if (fs.existsSync(techSource)) {
        fs.copyFileSync(techSource, techTarget);
        console.log(`${colors.green}✓${colors.reset} Copied ${tech.name} technology rules`);
      } else {
        console.log(`${colors.yellow}→${colors.reset} No template found for ${tech.name}`);
      }
    }
  }
}

// Helper function to copy tool rules
async function copyToolRules(targetDir) {
  if (!userSelections.tools || userSelections.tools.length === 0) {
    return;
  }

  const templateDir = path.join(__dirname, 'templates', 'tools');

  for (const tool of userSelections.tools) {
    if (tool.folder) {
      const toolSource = path.join(templateDir, `${tool.folder}.mdc`);
      const toolTarget = path.join(targetDir, 'tools', `${tool.folder}.mdc`);

      if (fs.existsSync(toolSource)) {
        fs.copyFileSync(toolSource, toolTarget);
        console.log(`${colors.green}✓${colors.reset} Copied ${tool.name} tool rules`);
      } else {
        console.log(`${colors.yellow}→${colors.reset} No template found for ${tool.name}`);
      }
    }
  }
}

// Create rule files using the project scanner
async function createRuleFilesFromScanner(targetDir) {
  console.log(`${colors.blue}Running Project Scanner to analyze your codebase...${colors.reset}`);

  const scannerPath = path.join(__dirname, 'src', 'scanner');
  const spinner = ora('Scanning project...').start();

  // The scanner target directory should be the .ai/rules folder or equivalent
  const projectPath = userSelections.projectPath;

  try {
    // Execute the scanner with proper arguments
    const outputPath = targetDir;
    const command = `node "${path.join(scannerPath, 'index.js')}" --path "${projectPath}" --output "${outputPath}" ${userSelections.verbose ? '--verbose' : ''}`;
    
    if (userSelections.verbose) {
      console.log(`${colors.dim}Running command: ${command}${colors.reset}`);
    }
    
    const { stdout, stderr } = await execPromise(command);

    spinner.succeed('Project scan completed successfully!');
    console.log(`${colors.green}✓${colors.reset} Successfully generated rule files using Project Scanner`);

    if (userSelections.verbose) {
      console.log(`\n${colors.dim}Scanner output:${colors.reset}`);
      console.log(stdout);
      if (stderr) {
        console.log(`\n${colors.dim}Scanner warnings:${colors.reset}`);
        console.log(stderr);
      }
    }

    return true;
  } catch (error) {
    spinner.fail('Project scan failed');
    console.error(`${colors.red}Error running Project Scanner:${colors.reset} ${error.message}`);
    if (userSelections.verbose) {
      console.error(`${colors.red}Error details:${colors.reset}`);
      console.error(error);
    }
    console.log(`${colors.yellow}Falling back to template-based rule generation${colors.reset}`);
    return false;
  }
}

// Create rule files from templates
async function createRuleFilesFromTemplates(targetDir) {
  console.log(`${colors.blue}Creating base rule files from templates...${colors.reset}`);

  const projectName = path.basename(path.resolve(userSelections.projectPath));
  const templateDir = path.join(__dirname, 'templates', 'rules');

  // Core rule files
  const coreFiles = [
    '00-core-agent.mdc',
    '01-project-context.mdc',
    '02-common-errors.mdc',
    '03-mcp-configuration.mdc'
  ];

  // Process each template file
  for (const file of coreFiles) {
    const templatePath = path.join(templateDir, file);
    const targetPath = path.join(targetDir, file);

    if (fs.existsSync(templatePath) && !fs.existsSync(targetPath)) {
      let content = fs.readFileSync(templatePath, 'utf8');

      // Replace variables
      content = content.replace(/\{\{projectName\}\}/g, projectName);
      content = content.replace(/\{\{projectFramework\}\}/g, userSelections.framework?.name || 'Not specified');
      content = content.replace(/\{\{projectLanguage\}\}/g, userSelections.language?.name || 'Not specified');

      // Additional replacements
      const techList = userSelections.technologies?.map(t => t.name).join(', ') || 'None';
      content = content.replace(/\{\{additionalTechnologies\}\}/g, techList);

      // Add a generic project purpose if not available
      content = content.replace(/\{\{projectPurpose\}\}/g, 'application');

      // Update timestamp
      const today = new Date().toISOString().split('T')[0];
      content = content.replace(/\{\{date\}\}/g, today);

      fs.writeFileSync(targetPath, content, 'utf8');
      console.log(`${colors.green}✓${colors.reset} Created ${file}`);
    } else if (fs.existsSync(targetPath)) {
      console.log(`${colors.yellow}→${colors.reset} File ${file} already exists, skipping`);
    } else {
      console.log(`${colors.yellow}→${colors.reset} Template ${file} not found, skipping`);
    }
  }

  console.log(`${colors.green}✓${colors.reset} Created rule files from templates`);
  return true;
}

// Function to prompt for setup mode selection
async function selectSetupMode() {
  console.log(`\n${colors.bright}${colors.magenta}Setup Configuration${colors.reset}`);

  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'setupMode',
        message: 'How would you like to configure VibeKit VDK CLI?',
        choices: [
          { name: '🔍 Automatic (Scan project and generate rules)', value: 'automatic' },
          { name: '🔧 Manual (Select options individually)', value: 'manual' },
          { name: '🔄 Hybrid (Auto-scan with manual adjustments)', value: 'hybrid' },
          { name: '☁️ Remote (Download latest rules from repository)', value: 'remote' }
        ],
        default: 'automatic'
      }
    ]);

    userSelections.setupMode = answers.setupMode;

    // Only ask additional questions if we got a valid setup mode
    if (answers.setupMode) {
      const additionalAnswers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'verbose',
          message: 'Enable verbose output for detailed information?',
          default: false,
          when: () => answers.setupMode !== 'manual'
        },
        {
          type: 'confirm',
          name: 'syncRules',
          message: 'Sync with remote rules repository before setup?',
          default: true,
          when: () => answers.setupMode !== 'remote'
        }
      ]);

      userSelections.verbose = additionalAnswers.verbose || false;
      userSelections.syncRules = additionalAnswers.syncRules || (answers.setupMode === 'remote');

      console.log(`${colors.green}✓${colors.reset} Selected ${colors.cyan}${answers.setupMode}${colors.reset} setup mode${userSelections.verbose ? ' with verbose output' : ''}${userSelections.syncRules ? ' with remote sync' : ''}`);
    }
  } catch (error) {
    if (error.isTtyError) {
      console.log(`${colors.yellow}→${colors.reset} TTY not available, using automatic mode`);
      userSelections.setupMode = 'automatic';
      userSelections.verbose = false;
      userSelections.syncRules = true;
    } else {
      throw error;
    }
  }
}

/**
 * Synchronize with remote rules repository
 * Downloads the latest rules from the remote repository
 */
async function syncWithRemoteRules() {
  console.log(`\n${colors.bright}${colors.blue}Synchronizing with remote rules repository...${colors.reset}`);
  console.log(`Repository: ${colors.cyan}https://github.com/idominikosgr/VibeKit-VDK-AI-rules${colors.reset}`);

  try {
    // Check if sync is initialized
    const syncConfig = ruleSync.loadSyncConfig();
    if (!syncConfig.initialized) {
      console.log(`${colors.yellow}→${colors.reset} Initializing sync configuration...`);
      
      // Auto-initialize with sensible defaults for wizard usage
      const autoConfig = {
        ...syncConfig,
        conflictResolution: 'remote', // Always use remote in wizard context
        autoSync: false,
        initialized: true,
        initDate: new Date().toISOString()
      };
      
      ruleSync.saveSyncConfig(autoConfig);
    }

    // Perform the sync
    const result = await ruleSync.performSync({ force: false });
    
    if (result.status === 'up_to_date') {
      console.log(`${colors.green}✓${colors.reset} Rules are already up to date`);
      return true;
    } else if (result.status === 'completed') {
      console.log(`${colors.green}✓${colors.reset} Successfully synchronized ${result.filesProcessed} rule files`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`${colors.yellow}→${colors.reset} Remote sync failed: ${error.message}`);
    console.log(`${colors.yellow}→${colors.reset} Continuing with local templates...`);
    return false;
  }
}

/**
 * Updates the MCP configuration file with editor-specific paths and configurations
 * This function uses the editor-path-resolver to detect configurations and
 * update the 03-mcp-configuration.mdc file with accurate paths
 *
 * @param {string} targetDir - Path to the rules directory
 * @returns {boolean} - Success status
 */
async function updateMCPConfiguration(targetDir) {
  console.log(`${colors.blue}Updating MCP configuration with editor paths...${colors.reset}`);

  // Check if the MCP configuration file exists
  const mcpFilePath = path.join(targetDir, '03-mcp-configuration.mdc');
  if (!fs.existsSync(mcpFilePath)) {
    console.log(`${colors.yellow}→${colors.reset} MCP configuration file not found. Creating from template...`);

    // Copy from template if available
    const templatePath = path.join(__dirname, 'templates', 'rules', '03-mcp-configuration.mdc');
    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, mcpFilePath);
    } else {
      // Create minimal MCP configuration file
      console.log(`${colors.yellow}→${colors.reset} Template not found. Creating minimal MCP configuration.`);
      fs.writeFileSync(mcpFilePath, `---
description: Defines the available Model Context Protocol (MCP) servers and their capabilities.
globs:
alwaysApply: false
version: "2.1.0"
lastUpdated: "${new Date().toISOString().split('T')[0]}"
compatibleWith: ["Memory-MCP", "Sequential-Thinking-Advanced", "MCP-Integration"]
---
# MCP Server Configuration

This file documents the Model Context Protocol (MCP) servers available in your environment.

`, 'utf8');
    }
  }

  // Update the MCP configuration with editor paths
  try {
    const success = editorPathResolver.updateMCPConfigurationFile(userSelections.projectPath, targetDir);
    if (success) {
      console.log(`${colors.green}✓${colors.reset} Successfully updated MCP configuration with editor paths`);
    } else {
      console.log(`${colors.yellow}→${colors.reset} Failed to update MCP configuration. Manual update may be required.`);
    }
    return true;
  } catch (error) {
    console.log(`${colors.yellow}→${colors.reset} Error updating MCP configuration: ${error.message}`);
    return false;
  }
}

// Helper function to promisify exec
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        // Only reject if there's an actual error (non-zero exit code)
        reject(error);
      } else {
        // Success - stderr might contain warnings but that's OK
        resolve({ stdout, stderr });
      }
    });
  });
}

// Handle process interruption gracefully
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}⚠️ Setup cancelled by user${colors.reset}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(`\n${colors.yellow}⚠️ Setup terminated${colors.reset}`);
  process.exit(0);
});

// Main execution flow
async function main() {
  try {
    // Parse command line arguments
    const args = parseArguments();
    
    if (args.help) {
      showHelp();
      return;
    }

    // Set project path from arguments or use current directory
    const targetProjectPath = args.targetDir || process.cwd();
    
    // Validate that the target directory exists
    if (!fs.existsSync(targetProjectPath)) {
      console.error(`${colors.red}❌ Error: Target directory does not exist: ${targetProjectPath}${colors.reset}`);
      process.exit(1);
    }

    // Validate if this looks like a project directory
    const validation = validateProjectDirectory(targetProjectPath);
    
    if (!validation.isProject) {
      console.log(`${colors.yellow}⚠️ Warning: The target directory doesn't appear to be a project directory.${colors.reset}`);
      console.log(`${colors.cyan}Directory: ${targetProjectPath}${colors.reset}`);
      console.log(`${colors.yellow}No common project files were found (package.json, .git, requirements.txt, etc.)${colors.reset}`);
      
      // Check if running in non-interactive environment
      const isInteractive = process.stdin.isTTY && process.stdout.isTTY;
      
      if (!isInteractive) {
        console.log(`${colors.yellow}→ Non-interactive mode: Installing anyway...${colors.reset}`);
      } else {
        // Ask user if they want to continue
        const { continueAnyway } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continueAnyway',
            message: 'Do you want to continue installing in this directory?',
            default: false
          }
        ]);
        
        if (!continueAnyway) {
          console.log(`${colors.cyan}Installation cancelled. Please run this in a project directory or specify a different target with --target-dir${colors.reset}`);
          process.exit(0);
        }
      }
    } else {
      console.log(`${colors.green}✓ Project directory detected${colors.reset}`);
      console.log(`${colors.cyan}Found indicators: ${validation.indicators.slice(0, 3).join(', ')}${validation.indicators.length > 3 ? ` and ${validation.indicators.length - 3} more` : ''}${colors.reset}`);
    }

    // Set the validated project path
    userSelections.projectPath = path.resolve(targetProjectPath);

    // Check if running in non-interactive environment
    const isInteractive = process.stdin.isTTY && process.stdout.isTTY;
    
    if (!isInteractive) {
      console.log(`\n${colors.yellow}⚠️ Non-interactive environment detected${colors.reset}`);
      console.log(`${colors.cyan}→${colors.reset} Using automatic setup with default options...`);
      
      // Use automatic setup with defaults
      userSelections.setupMode = 'automatic';
      userSelections.verbose = false;
      userSelections.syncRules = true;
      userSelections.ideTool = 'generic';
      userSelections.ideToolName = 'Generic AI Tool';
      
      await copyRuleFiles();
      
      console.log(`\n${colors.bright}${colors.green}🎉 Setup Complete!${colors.reset}`);
      console.log(`\nVibeKit VDK CLI has been configured with default settings.`);
      console.log(`Rules have been installed for ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
      
      return;
    }

    // Display welcome banner
    console.log(`\n${colors.bright}${colors.cyan}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}║                    VibeKit VDK CLI Setup Wizard              ║${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}║              Configure AI Rules for Your Project            ║${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}╚══════════════════════════════════════════════════════════════╝${colors.reset}`);
    console.log(`\nWelcome! This wizard will help you set up VibeKit VDK CLI for your project.`);
    console.log(`We'll analyze your codebase and generate custom AI assistant rules.\n`);

    // Step 1: Select setup mode
    await selectSetupMode();

    // Step 2: Sync with remote rules if requested
    if (userSelections.syncRules) {
      await syncWithRemoteRules();
    }

    if (userSelections.setupMode === 'remote') {
      // Remote mode: Just sync and use remote rules with minimal user input
      console.log(`\n${colors.bright}${colors.cyan}Running Remote Setup...${colors.reset}`);
      
      // Auto-detect IDE
      const detectedIDEs = ideConfig.detectIDEs(userSelections.projectPath);
      if (detectedIDEs.length > 0) {
        userSelections.ideTool = detectedIDEs[0].id;
        userSelections.ideToolName = detectedIDEs[0].name;
        console.log(`${colors.green}✓${colors.reset} Auto-detected IDE: ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
      } else {
        await selectIDETool();
      }

      // Copy rules using templates (which are now synced from remote)
      await copyRuleFiles();

    } else if (userSelections.setupMode === 'automatic') {
      // Automatic mode: Use project scanner with minimal user input
      console.log(`\n${colors.bright}${colors.cyan}Running Automatic Setup...${colors.reset}`);
      
      // Auto-detect IDE
      const detectedIDEs = ideConfig.detectIDEs(userSelections.projectPath);
      if (detectedIDEs.length > 0) {
        userSelections.ideTool = detectedIDEs[0].id;
        userSelections.ideToolName = detectedIDEs[0].name;
        console.log(`${colors.green}✓${colors.reset} Auto-detected IDE: ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
      } else {
        userSelections.ideTool = 'generic';
        userSelections.ideToolName = 'Generic AI Tool';
        console.log(`${colors.yellow}→${colors.reset} No IDE detected, using generic configuration`);
      }

      // Generate rules using project scanner
      await copyRuleFiles();

    } else if (userSelections.setupMode === 'hybrid') {
      // Hybrid mode: Auto-scan first, then allow manual adjustments
      console.log(`\n${colors.bright}${colors.cyan}Running Hybrid Setup...${colors.reset}`);
      
      // Auto-detect IDE
      const detectedIDEs = ideConfig.detectIDEs(userSelections.projectPath);
      if (detectedIDEs.length > 0) {
        userSelections.ideTool = detectedIDEs[0].id;
        userSelections.ideToolName = detectedIDEs[0].name;
        console.log(`${colors.green}✓${colors.reset} Auto-detected IDE: ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
      } else {
        await selectIDETool();
      }

      // Generate rules using project scanner first
      const scannerSuccess = await copyRuleFiles();
      
      if (!scannerSuccess) {
        console.log(`\n${colors.yellow}Project scanner failed. Let's configure manually...${colors.reset}`);
        await selectFramework();
        await selectLanguage();
        await selectStack();
        await selectTechnologies();
        await selectTools();
        
        const confirmed = await confirmSelections();
        if (confirmed) {
          await copyRuleFiles();
        } else {
          console.log(`${colors.red}Setup cancelled.${colors.reset}`);
          process.exit(0);
        }
      }

    } else {
      // Manual mode: Full interactive setup
      console.log(`\n${colors.bright}${colors.cyan}Running Manual Setup...${colors.reset}`);
      
      await selectIDETool();
      await selectFramework();
      await selectLanguage();
      await selectStack();
      await selectTechnologies();
      await selectTools();
      
      const confirmed = await confirmSelections();
      if (confirmed) {
        await copyRuleFiles();
      } else {
        console.log(`${colors.red}Setup cancelled.${colors.reset}`);
        process.exit(0);
      }
    }

    // Success message
    console.log(`\n${colors.bright}${colors.green}🎉 Setup Complete!${colors.reset}`);
    console.log(`\nVibeKit VDK CLI has been configured for your project.`);
    console.log(`Rules have been installed for ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
    
    const ideTool = ideConfig.getIDEConfigById(userSelections.ideTool);
    if (ideTool) {
      console.log(`\n${colors.bright}Next Steps:${colors.reset}`);
      console.log(`1. Check the generated rules in: ${colors.cyan}${ideTool.rulesFolder}${colors.reset}`);
      console.log(`2. Customize any rules as needed for your project`);
      console.log(`3. Restart your AI assistant to load the new rules`);
      console.log(`4. Start coding with enhanced AI assistance! 🚀`);
    }

  } catch (error) {
    if (error.isTtyError) {
      console.error(`\n${colors.yellow}⚠️ TTY not available:${colors.reset} Running in non-interactive mode`);
      console.log(`${colors.cyan}→${colors.reset} Using automatic setup with default options...`);
      
      // Fallback to automatic setup
      userSelections.setupMode = 'automatic';
      userSelections.verbose = false;
      userSelections.syncRules = true;
      userSelections.ideTool = 'generic';
      userSelections.ideToolName = 'Generic AI Tool';
      
      await copyRuleFiles();
      
      console.log(`\n${colors.bright}${colors.green}🎉 Setup Complete!${colors.reset}`);
      console.log(`\nvdk-cli has been configured with default settings.`);
      console.log(`Rules have been installed for ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
      
    } else if (error.name === 'ExitPromptError' || error.message.includes('force closed')) {
      console.error(`\n${colors.yellow}⚠️ Setup cancelled by user${colors.reset}`);
      process.exit(0);
    } else {
      console.error(`\n${colors.red}❌ Setup failed:${colors.reset} ${error.message}`);
      if (userSelections.verbose) {
        console.error(`\n${colors.dim}Stack trace:${colors.reset}`);
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

// Run the main function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(`\n${colors.red}❌ Unhandled error:${colors.reset} ${error.message}`);
    process.exit(1);
  });
}