/**
 * RuleGenerator.js
 *
 * Generates custom CodePilotRules based on project analysis results.
 * Creates rule files with appropriate templates for the detected
 * technology stack, patterns, and architecture.
 */

import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import {
  TEMPLATES,
  RULES,
  DIRECTORIES,
  LANGUAGE_RULE_MAP,
  FRAMEWORK_RULE_MAP,
  INTEGRATION_RULES,
  PATTERN_RULE_MAP,
  DEFAULTS
} from '../utils/constants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class RuleGenerator {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.outputPath = options.outputPath || DEFAULTS.OUTPUT_PATH;
    this.templatesDir = options.templatesDir || path.join(__dirname, '../templates');
    this.generatedFiles = [];

    // Register Handlebars helpers
    this.registerHandlebarsHelpers();
  }

  /**
   * Generates rule files based on project analysis
   * @param {Object} analysisData - Combined analysis results
   * @returns {string[]} List of generated file paths
   */
  async generateRules(analysisData) {
    if (this.verbose) {
      console.log(chalk.gray('Starting rule generation...'));
    }

    this.generatedFiles = [];

    try {
      // Ensure output directory exists
      await fs.mkdir(this.outputPath, { recursive: true });

      // Generate core rules
      await this.generateCoreRules(analysisData);

      // Generate project context rule
      await this.generateProjectContextRule(analysisData);

      // Generate common errors rule
      await this.generateCommonErrorsRule(analysisData);

      // Generate MCP configuration rule
      await this.generateMcpConfigRule(analysisData);

      // Generate language-specific rules
      await this.generateLanguageRules(analysisData);

      // Generate framework/technology-specific rules
      await this.generateFrameworkRules(analysisData);

      // Generate stack-specific rules
      await this.generateStackRules(analysisData);

      // Generate task-specific rules
      await this.generateTaskRules(analysisData);

      // Generate tool-specific rules
      await this.generateToolRules(analysisData);

      // Generate assistant-specific rules
      await this.generateAssistantRules(analysisData);

      return this.generatedFiles;
    } catch (error) {
      if (this.verbose) {
        console.error(chalk.red(`Error in rule generation: ${error.message}`));
        console.error(chalk.gray(error.stack));
      }
      throw new Error(`Rule generation failed: ${error.message}`);
    }
  }

  /**
   * Generates the 00-core-agent.mdc file with core agent behavior
   * @param {Object} analysisData - Combined analysis results
   */
  async generateCoreRules(analysisData) {
    if (this.verbose) {
      console.log(chalk.gray('Generating core agent rule...'));
    }

    const coreAgentPath = path.join(this.outputPath, RULES.CORE_AGENT);

    // Load the template
    const templatePath = path.join(this.templatesDir, TEMPLATES.CORE_AGENT);
    let templateContent;

    try {
      templateContent = await fs.readFile(templatePath, 'utf8');
    } catch (error) {
      // If template doesn't exist, create a default one
      templateContent = this.getDefaultCoreAgentTemplate();

      // Save the default template for future use
      try {
        await fs.mkdir(path.dirname(templatePath), { recursive: true });
        await fs.writeFile(templatePath, templateContent, 'utf8');
      } catch (templateSaveError) {
        if (this.verbose) {
          console.log(chalk.yellow(`Could not save default template: ${templateSaveError.message}`));
        }
      }
    }

    // Compile the template
    const template = Handlebars.compile(templateContent);

    // Prepare the template data
    const templateData = {
      date: new Date().toISOString().split('T')[0],
      projectName: path.basename(analysisData.projectStructure?.root || DEFAULTS.PROJECT_NAME),
      namingConventions: analysisData.patterns?.namingConventions || {}
    };

    // Generate the rule content
    const ruleContent = template(templateData);

    // Write the rule file
    await fs.writeFile(coreAgentPath, ruleContent, 'utf8');
    this.generatedFiles.push(coreAgentPath);

    if (this.verbose) {
      console.log(chalk.gray(`Generated core agent rule at: ${coreAgentPath}`));
    }
  }

  /**
   * Generates the 01-project-context.mdc file with project-specific information
   * @param {Object} analysisData - Combined analysis results
   */
  async generateProjectContextRule(analysisData) {
    if (this.verbose) {
      console.log(chalk.gray('Generating project context rule...'));
    }

    const projectContextPath = path.join(this.outputPath, RULES.PROJECT_CONTEXT);

    // Load the template
    const templatePath = path.join(this.templatesDir, TEMPLATES.PROJECT_CONTEXT);
    let templateContent;

    try {
      templateContent = await fs.readFile(templatePath, 'utf8');
    } catch (error) {
      // If template doesn't exist, create a default one
      templateContent = this.getDefaultProjectContextTemplate();

      // Save the default template for future use
      try {
        await fs.mkdir(this.templatesDir, { recursive: true });
        await fs.writeFile(templatePath, templateContent, 'utf8');
      } catch (templateSaveError) {
        if (this.verbose) {
          console.log(chalk.yellow(`Could not save default template: ${templateSaveError.message}`));
        }
      }
    }

    // Compile the template
    const template = Handlebars.compile(templateContent);

    // Extract the project name from the analysis data or use a default
    let projectName = DEFAULTS.PROJECT_NAME;
    if (analysisData.projectStructure && analysisData.projectStructure.root) {
      projectName = path.basename(analysisData.projectStructure.root);
    }

    // Prepare the template data
    const templateData = {
      projectName,
      date: new Date().toISOString().split('T')[0],
      primaryLanguages: analysisData.techStack?.primaryLanguages || [],
      frameworks: analysisData.techStack?.frameworks || [],
      libraries: analysisData.techStack?.libraries || [],
      testingFrameworks: analysisData.techStack?.testingFrameworks || [],
      buildTools: analysisData.techStack?.buildTools || [],
      linters: analysisData.techStack?.linters || [],
      architecturalPatterns: analysisData.patterns?.architecturalPatterns || [],
      namingConventions: analysisData.patterns?.namingConventions || {},
      structureStats: {
        files: analysisData.projectStructure?.fileCount || 0,
        directories: analysisData.projectStructure?.directoryCount || 0,
        fileTypes: Object.keys(analysisData.projectStructure?.fileTypes || {})
      }
    };

    // Generate the rule content
    const ruleContent = template(templateData);

    // Write the rule file
    await fs.writeFile(projectContextPath, ruleContent, 'utf8');
    this.generatedFiles.push(projectContextPath);

    if (this.verbose) {
      console.log(chalk.gray(`Generated project context rule at: ${projectContextPath}`));
    }
  }

  /**
   * Generates the 02-common-errors.mdc file with project-specific error patterns
   * @param {Object} analysisData - Combined analysis results
   */
  async generateCommonErrorsRule(analysisData) {
    if (this.verbose) {
      console.log(chalk.gray('Generating common errors rule...'));
    }

    const commonErrorsPath = path.join(this.outputPath, RULES.COMMON_ERRORS);

    // Load the template
    const templatePath = path.join(this.templatesDir, TEMPLATES.COMMON_ERRORS);
    let templateContent;

    try {
      templateContent = await fs.readFile(templatePath, 'utf8');
    } catch (error) {
      // If template doesn't exist, create a default one
      templateContent = this.getDefaultCommonErrorsTemplate();

      // Save the default template for future use
      try {
        await fs.mkdir(path.dirname(templatePath), { recursive: true });
        await fs.writeFile(templatePath, templateContent, 'utf8');
      } catch (templateSaveError) {
        if (this.verbose) {
          console.log(chalk.yellow(`Could not save default template: ${templateSaveError.message}`));
        }
      }
    }

    // Compile the template
    const template = Handlebars.compile(templateContent);

    // Prepare the template data
    const templateData = {
      date: new Date().toISOString().split('T')[0],
      projectName: path.basename(analysisData.projectStructure?.root || DEFAULTS.PROJECT_NAME)
    };

    // Generate the rule content
    const ruleContent = template(templateData);

    // Write the rule file
    await fs.writeFile(commonErrorsPath, ruleContent, 'utf8');
    this.generatedFiles.push(commonErrorsPath);

    if (this.verbose) {
      console.log(chalk.gray(`Generated common errors rule at: ${commonErrorsPath}`));
    }
  }

  /**
   * Generates the 03-mcp-configuration.mdc file with MCP server configuration
   * @param {Object} analysisData - Combined analysis results
   */
  async generateMcpConfigRule(analysisData) {
    if (this.verbose) {
      console.log(chalk.gray('Generating MCP configuration rule...'));
    }

    const mcpConfigPath = path.join(this.outputPath, RULES.MCP_CONFIGURATION);

    // Load the template
    const templatePath = path.join(this.templatesDir, TEMPLATES.MCP_CONFIGURATION);
    let templateContent;

    try {
      templateContent = await fs.readFile(templatePath, 'utf8');
    } catch (error) {
      // If template doesn't exist, create a default one
      templateContent = this.getDefaultMcpConfigTemplate();

      // Save the default template for future use
      try {
        await fs.mkdir(path.dirname(templatePath), { recursive: true });
        await fs.writeFile(templatePath, templateContent, 'utf8');
      } catch (templateSaveError) {
        if (this.verbose) {
          console.log(chalk.yellow(`Could not save default template: ${templateSaveError.message}`));
        }
      }
    }

    // Compile the template
    const template = Handlebars.compile(templateContent);

    // Prepare the template data
    const templateData = {
      date: new Date().toISOString().split('T')[0]
    };

    // Generate the rule content
    const ruleContent = template(templateData);

    // Write the rule file
    await fs.writeFile(mcpConfigPath, ruleContent, 'utf8');
    this.generatedFiles.push(mcpConfigPath);

    if (this.verbose) {
      console.log(chalk.gray(`Generated MCP configuration rule at: ${mcpConfigPath}`));
    }
  }

  /**
   * Generates language-specific rules based on detected languages
   * @param {Object} analysisData - Combined analysis results
   */
  async generateLanguageRules(analysisData) {
    if (!analysisData.techStack || !analysisData.techStack.primaryLanguages) {
      return;
    }

    const languageDirPath = path.join(this.outputPath, DIRECTORIES.LANGUAGES);
    await fs.mkdir(languageDirPath, { recursive: true });

    // Get unique list of languages
    const languages = [...new Set(analysisData.techStack.primaryLanguages)];

    for (const language of languages) {
      const normalizedLang = language.toLowerCase();
      let ruleName = LANGUAGE_RULE_MAP[normalizedLang];

      // Skip if we don't have a template for this language
      if (!ruleName) continue;

      // For React-specific languages, use the framework ruleName
      if (normalizedLang.includes('react')) {
        continue; // Will handle in framework rules
      }

      if (this.verbose) {
        console.log(chalk.gray(`Generating rule for language: ${language}`));
      }

      const ruleFilePath = path.join(languageDirPath, ruleName);
      const templatePath = path.join(this.templatesDir, `languages/${ruleName}.hbs`);

      try {
        // First try to get a language-specific template
        let templateContent = await this.getTemplateContent(templatePath, normalizedLang);

        // Compile the template
        const template = Handlebars.compile(templateContent);

        // Prepare the template data
        const templateData = {
          language,
          date: new Date().toISOString().split('T')[0],
          namingConventions: analysisData.patterns?.namingConventions || {},
          frameworks: analysisData.techStack?.frameworks || [],
          libraries: analysisData.techStack?.libraries || [],
          testingFrameworks: analysisData.techStack?.testingFrameworks || []
        };

        // Generate the rule content
        const ruleContent = template(templateData);

        // Write the rule file
        await fs.writeFile(ruleFilePath, ruleContent, 'utf8');
        this.generatedFiles.push(ruleFilePath);

        if (this.verbose) {
          console.log(chalk.gray(`Generated language rule at: ${ruleFilePath}`));
        }
      } catch (error) {
        if (this.verbose) {
          console.log(chalk.yellow(`Could not generate language rule for ${language}: ${error.message}`));
        }
      }
    }
  }

  /**
   * Generates framework-specific rules based on detected frameworks
   * @param {Object} analysisData - Combined analysis results
   */
  async generateFrameworkRules(analysisData) {
    if (!analysisData.techStack || !analysisData.techStack.frameworks) {
      return;
    }

    const techDirPath = path.join(this.outputPath, DIRECTORIES.TECHNOLOGIES);
    await fs.mkdir(techDirPath, { recursive: true });

    // Get unique list of frameworks
    const frameworks = [...new Set(analysisData.techStack.frameworks)];

    // First pass: Generate rules for each framework
    for (const framework of frameworks) {
      let ruleName = FRAMEWORK_RULE_MAP[framework];

      // Skip if we don't have a template for this framework
      if (!ruleName) continue;

      if (this.verbose) {
        console.log(chalk.gray(`Generating rule for framework: ${framework}`));
      }

      const ruleFilePath = path.join(techDirPath, ruleName);
      const templatePath = path.join(this.templatesDir, `technologies/${ruleName}.hbs`);

      try {
        // First try to get a framework-specific template
        let templateContent = await this.getTemplateContent(templatePath, framework.toLowerCase());

        // Compile the template
        const template = Handlebars.compile(templateContent);

        // Prepare the template data
        const templateData = {
          framework,
          date: new Date().toISOString().split('T')[0],
          namingConventions: analysisData.patterns?.namingConventions || {},
          libraries: analysisData.techStack?.libraries || [],
          testingFrameworks: analysisData.techStack?.testingFrameworks || []
        };

        // Generate the rule content
        const ruleContent = template(templateData);

        // Write the rule file
        await fs.writeFile(ruleFilePath, ruleContent, 'utf8');
        this.generatedFiles.push(ruleFilePath);

        if (this.verbose) {
          console.log(chalk.gray(`Generated framework rule at: ${ruleFilePath}`));
        }
      } catch (error) {
        if (this.verbose) {
          console.log(chalk.yellow(`Could not generate framework rule for ${framework}: ${error.message}`));
        }
      }
    }

    // Second pass: Generate integration rules
    for (const framework1 of frameworks) {
      const integrations = INTEGRATION_RULES[framework1];
      if (!integrations) continue;

      for (const framework2 of frameworks) {
        const integrationRuleName = integrations[framework2];
        if (!integrationRuleName) continue;

        if (this.verbose) {
          console.log(chalk.gray(`Generating integration rule for ${framework1} and ${framework2}`));
        }

        const ruleFilePath = path.join(techDirPath, integrationRuleName);
        const templatePath = path.join(this.templatesDir, `technologies/integrations/${integrationRuleName}.hbs`);

        try {
          // Try to get an integration-specific template
          let templateContent = await this.getTemplateContent(
            templatePath,
            `${framework1.toLowerCase()}-${framework2.toLowerCase()}-integration`
          );

          // Compile the template
          const template = Handlebars.compile(templateContent);

          // Prepare the template data
          const templateData = {
            framework1,
            framework2,
            date: new Date().toISOString().split('T')[0],
            namingConventions: analysisData.patterns?.namingConventions || {}
          };

          // Generate the rule content
          const ruleContent = template(templateData);

          // Write the rule file
          await fs.writeFile(ruleFilePath, ruleContent, 'utf8');
          this.generatedFiles.push(ruleFilePath);

          if (this.verbose) {
            console.log(chalk.gray(`Generated integration rule at: ${ruleFilePath}`));
          }
        } catch (error) {
          if (this.verbose) {
            console.log(chalk.yellow(
              `Could not generate integration rule for ${framework1} and ${framework2}: ${error.message}`
            ));
          }
        }
      }
    }
  }

  /**
   * Registers custom Handlebars helpers for templates
   */
  registerHandlebarsHelpers() {
    Handlebars.registerHelper('capitalize', function(str) {
      if (typeof str !== 'string') return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    });

    Handlebars.registerHelper('lowercase', function(str) {
      if (typeof str !== 'string') return '';
      return str.toLowerCase();
    });

    Handlebars.registerHelper('join', function(array, separator) {
      if (!Array.isArray(array)) return '';
      return array.join(separator || ', ');
    });

    Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
      switch (operator) {
        case '==': return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=': return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==': return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<': return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=': return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>': return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=': return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&': return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||': return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default: return options.inverse(this);
      }
    });
  }

  /**
   * Gets template content from file or generates a default template
   * @param {string} templatePath - Path to the template file
   * @param {string} type - Type of template (e.g., 'javascript', 'react')
   * @returns {string} Template content
   */
  async getTemplateContent(templatePath, type) {
    try {
      // First try to read the template file
      return await fs.readFile(templatePath, 'utf8');
    } catch (error) {
      // If template doesn't exist, use appropriate default template based on the path
      const templateDir = path.dirname(templatePath);
      const dirName = path.basename(templateDir);

      switch (dirName) {
        case DIRECTORIES.LANGUAGES:
          return this.getDefaultLanguageTemplate(type);
        case DIRECTORIES.FRAMEWORKS:
        case DIRECTORIES.TECHNOLOGIES:
          return this.getDefaultFrameworkTemplate(type);
        case DIRECTORIES.STACKS:
          return this.getDefaultStackTemplate(type);
        case DIRECTORIES.TASKS:
          return this.getDefaultTaskTemplate(type);
        case DIRECTORIES.TOOLS:
          return this.getDefaultToolTemplate(type);
        case DIRECTORIES.ASSISTANTS:
          return this.getDefaultAssistantTemplate(type);
        default:
          // For core templates, use the specific getter method
          if (templatePath.includes(TEMPLATES.CORE_AGENT)) {
            return this.getDefaultCoreAgentTemplate();
          } else if (templatePath.includes(TEMPLATES.COMMON_ERRORS)) {
            return this.getDefaultCommonErrorsTemplate();
          } else if (templatePath.includes(TEMPLATES.MCP_CONFIGURATION)) {
            return this.getDefaultMcpConfigTemplate();
          } else {
            throw new Error(`No default template available for ${templatePath}`);
          }
      }
    }
  }
}