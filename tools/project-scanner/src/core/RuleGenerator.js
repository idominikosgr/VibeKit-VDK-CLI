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

    // Use the outputPath from analysisData if provided, otherwise use the default
    const outputPath = analysisData.outputPath || this.outputPath;
    this.outputPath = outputPath; // Update the instance variable

    try {
      // Ensure output directory exists
      await fs.mkdir(outputPath, { recursive: true });

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
    try {
      await fs.writeFile(coreAgentPath, ruleContent, 'utf8');
      this.generatedFiles.push(coreAgentPath);
      
      if (this.verbose) {
        console.log(chalk.gray(`Generated core agent rule at: ${coreAgentPath}`));
      } else {
        console.log(`Generated core agent rule at: ${path.relative(process.cwd(), coreAgentPath)}`);
      }
    } catch (writeError) {
      console.error(chalk.red(`Failed to write core agent rule: ${writeError.message}`));
      throw writeError;
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
    try {
      await fs.writeFile(projectContextPath, ruleContent, 'utf8');
      this.generatedFiles.push(projectContextPath);
      
      if (this.verbose) {
        console.log(chalk.gray(`Generated project context rule at: ${projectContextPath}`));
      } else {
        console.log(`Generated project context rule at: ${path.relative(process.cwd(), projectContextPath)}`);
      }
    } catch (writeError) {
      console.error(chalk.red(`Failed to write project context rule: ${writeError.message}`));
      throw writeError;
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

  /**
   * Generates stack-specific rules based on detected technology stacks
   * @param {Object} analysisData - Combined analysis results
   */
  async generateStackRules(analysisData) {
    if (!analysisData.techStack || !analysisData.techStack.stacks || analysisData.techStack.stacks.length === 0) {
      return;
    }

    const stackDirPath = path.join(this.outputPath, DIRECTORIES.STACKS);
    await fs.mkdir(stackDirPath, { recursive: true });

    for (const stack of analysisData.techStack.stacks) {
      if (this.verbose) {
        console.log(chalk.gray(`Generating rule for stack: ${stack}`));
      }

      const stackFileName = `${stack.toLowerCase().replace(/[^a-z0-9]/g, '-')}.mdc`;
      const ruleFilePath = path.join(stackDirPath, stackFileName);
      const templatePath = path.join(this.templatesDir, `stacks/${stackFileName}.hbs`);

      try {
        let templateContent = await this.getTemplateContent(templatePath, stack.toLowerCase());

        const template = Handlebars.compile(templateContent);
        const templateData = {
          stack,
          date: new Date().toISOString().split('T')[0],
          frameworks: analysisData.techStack?.frameworks || [],
          libraries: analysisData.techStack?.libraries || [],
          primaryLanguages: analysisData.techStack?.primaryLanguages || []
        };

        const ruleContent = template(templateData);
        await fs.writeFile(ruleFilePath, ruleContent, 'utf8');
        this.generatedFiles.push(ruleFilePath);

        if (this.verbose) {
          console.log(chalk.gray(`Generated stack rule at: ${ruleFilePath}`));
        }
      } catch (error) {
        if (this.verbose) {
          console.log(chalk.yellow(`Could not generate stack rule for ${stack}: ${error.message}`));
        }
      }
    }
  }

  /**
   * Generates task-specific rules
   * @param {Object} analysisData - Combined analysis results
   */
  async generateTaskRules(analysisData) {
    // For now, this is a placeholder - tasks would be determined by user selection or project analysis
    if (this.verbose) {
      console.log(chalk.gray('Skipping task rule generation (not implemented)'));
    }
  }

  /**
   * Generates tool-specific rules
   * @param {Object} analysisData - Combined analysis results
   */
  async generateToolRules(analysisData) {
    // For now, this is a placeholder - tools would be determined by user selection or project analysis
    if (this.verbose) {
      console.log(chalk.gray('Skipping tool rule generation (not implemented)'));
    }
  }

  /**
   * Generates assistant-specific rules
   * @param {Object} analysisData - Combined analysis results
   */
  async generateAssistantRules(analysisData) {
    // For now, this is a placeholder - assistants would be determined by user selection or project analysis
    if (this.verbose) {
      console.log(chalk.gray('Skipping assistant rule generation (not implemented)'));
    }
  }

  /**
   * Gets default language template
   * @param {string} language - Language type
   * @returns {string} Default template content
   */
  getDefaultLanguageTemplate(language) {
    return `---
description: Rules and patterns for {{capitalize language}} development
globs:
alwaysApply: false
version: "2.1.0"
lastUpdated: "{{date}}"
compatibleWith: ["{{capitalize language}}", "Modern-Development"]
---

# {{capitalize language}} Development Rules

## Language-Specific Patterns

### Naming Conventions
- Use appropriate {{language}} naming conventions
- Follow community standards and best practices

### Code Organization
- Structure code according to {{language}} conventions
- Use appropriate module/package organization

### Best Practices
- Follow {{language}}-specific best practices
- Use modern language features appropriately
- Implement proper error handling

## Integration Guidelines

When working with {{language}}:
1. Follow established patterns in the codebase
2. Use appropriate tooling and linting
3. Maintain consistency with existing code style
4. Document complex logic appropriately

---
NOTE TO AI: Apply these rules when working with {{language}} files in this project.
`;
  }

  /**
   * Gets default framework template
   * @param {string} framework - Framework type
   * @returns {string} Default template content
   */
  getDefaultFrameworkTemplate(framework) {
    return `---
description: Rules and patterns for {{capitalize framework}} development
globs:
alwaysApply: false
version: "2.1.0"
lastUpdated: "{{date}}"
compatibleWith: ["{{capitalize framework}}", "Modern-Development"]
---

# {{capitalize framework}} Development Rules

## Framework-Specific Patterns

### Component Structure
- Follow {{framework}} component patterns
- Use appropriate lifecycle methods
- Implement proper state management

### Best Practices
- Follow {{framework}} best practices
- Use framework-specific tooling
- Implement proper testing patterns

## Integration Guidelines

When working with {{framework}}:
1. Follow established patterns in the codebase
2. Use appropriate {{framework}} conventions
3. Maintain consistency with existing architecture
4. Document component interfaces appropriately

---
NOTE TO AI: Apply these rules when working with {{framework}} components in this project.
`;
  }

  /**
   * Gets default stack template
   * @param {string} stack - Stack type
   * @returns {string} Default template content
   */
  getDefaultStackTemplate(stack) {
    return `---
description: Rules and patterns for {{stack}} development
globs:
alwaysApply: false
version: "2.1.0"
lastUpdated: "{{date}}"
compatibleWith: ["{{stack}}", "Full-Stack-Development"]
---

# {{stack}} Development Rules

## Stack-Specific Patterns

### Architecture
- Follow {{stack}} architectural patterns
- Implement proper separation of concerns
- Use appropriate data flow patterns

### Integration
- Ensure proper integration between stack components
- Use appropriate communication patterns
- Implement proper error handling across the stack

## Best Practices

When working with {{stack}}:
1. Follow established patterns for this stack
2. Maintain consistency across all layers
3. Use appropriate tooling for the entire stack
4. Document integration points appropriately

---
NOTE TO AI: Apply these rules when working with {{stack}} architecture in this project.
`;
  }

  /**
   * Gets default task template
   * @param {string} task - Task type
   * @returns {string} Default template content
   */
  getDefaultTaskTemplate(task) {
    return `---
description: Rules for {{task}} tasks
globs:
alwaysApply: false
version: "2.1.0"
lastUpdated: "{{date}}"
compatibleWith: ["{{capitalize task}}", "Task-Management"]
---

# {{capitalize task}} Task Rules

## Task-Specific Guidelines

### Approach
- Follow systematic approach for {{task}}
- Break down complex tasks into manageable steps
- Document progress and decisions

### Best Practices
- Use appropriate tools and methodologies
- Maintain code quality throughout the task
- Test thoroughly before completion

---
NOTE TO AI: Apply these rules when performing {{task}} tasks in this project.
`;
  }

  /**
   * Gets default tool template
   * @param {string} tool - Tool type
   * @returns {string} Default template content
   */
  getDefaultToolTemplate(tool) {
    return `---
description: Rules for {{tool}} tool usage
globs:
alwaysApply: false
version: "2.1.0"
lastUpdated: "{{date}}"
compatibleWith: ["{{capitalize tool}}", "Tool-Integration"]
---

# {{capitalize tool}} Tool Rules

## Tool-Specific Guidelines

### Usage
- Use {{tool}} according to best practices
- Follow tool-specific conventions
- Integrate properly with existing workflow

### Configuration
- Maintain consistent tool configuration
- Document tool-specific settings
- Ensure compatibility with project requirements

---
NOTE TO AI: Apply these rules when using {{tool}} in this project.
`;
  }

  /**
   * Gets default assistant template
   * @param {string} assistant - Assistant type
   * @returns {string} Default template content
   */
  getDefaultAssistantTemplate(assistant) {
    return `---
description: Rules for {{assistant}} assistant integration
globs:
alwaysApply: false
version: "2.1.0"
lastUpdated: "{{date}}"
compatibleWith: ["{{capitalize assistant}}", "AI-Assistant"]
---

# {{capitalize assistant}} Assistant Rules

## Assistant-Specific Guidelines

### Integration
- Use {{assistant}} according to project needs
- Follow assistant-specific best practices
- Maintain consistency with project workflow

### Interaction
- Provide clear context and requirements
- Use appropriate assistant capabilities
- Document assistant interactions when needed

---
NOTE TO AI: Apply these rules when working with {{assistant}} in this project.
`;
  }

  /**
   * Gets default core agent template
   * @returns {string} Default template content
   */
  getDefaultCoreAgentTemplate() {
    return `---
description: Core agent behavior and fundamental rules for AI assistance
globs:
alwaysApply: true
version: "2.1.0"
lastUpdated: "{{date}}"
compatibleWith: ["All-AI-Assistants", "Core-Behavior"]
---

# Core Agent Rules

## Fundamental Behavior

### Code Quality Standards
- Always write clean, readable, and maintainable code
- Follow established patterns and conventions in the project
- Implement proper error handling and edge case management
- Use meaningful variable and function names

### Project Integration
- Understand the project context before making changes
- Maintain consistency with existing codebase patterns
- Consider the impact of changes on the entire system
- Follow the project's architectural decisions

### Communication
- Provide clear explanations for code changes
- Document complex logic and architectural decisions
- Ask for clarification when requirements are ambiguous
- Suggest improvements while respecting project constraints

## Development Principles

1. **Backward Compatibility**: Maintain compatibility unless explicitly told otherwise
2. **Security First**: Always consider security implications of code changes
3. **Performance Awareness**: Write efficient code and consider performance impact
4. **Testing**: Include appropriate tests for new functionality
5. **Documentation**: Keep documentation up to date with code changes

---
NOTE TO AI: These are the fundamental rules that apply to all interactions in this project.
`;
  }

  /**
   * Gets default common errors template
   * @returns {string} Default template content
   */
  getDefaultCommonErrorsTemplate() {
    return `---
description: Common errors and anti-patterns to avoid in this project
globs:
alwaysApply: true
version: "2.1.0"
lastUpdated: "{{date}}"
compatibleWith: ["Error-Prevention", "Code-Quality"]
---

# Common Errors and Anti-Patterns

## General Anti-Patterns

### Code Quality Issues
- Avoid hardcoded values without proper configuration
- Don't ignore error handling or use empty catch blocks
- Avoid deeply nested code structures
- Don't use magic numbers or unclear variable names

### Architecture Issues
- Avoid tight coupling between modules
- Don't bypass established patterns without good reason
- Avoid circular dependencies
- Don't mix concerns in single functions or classes

### Security Issues
- Never expose sensitive information in logs or error messages
- Don't trust user input without validation
- Avoid using deprecated or insecure libraries
- Don't hardcode credentials or API keys

## Project-Specific Patterns to Avoid

### Common Mistakes
- Review existing code patterns before implementing new features
- Follow the established error handling patterns
- Use the project's logging and monitoring conventions
- Maintain consistency with existing API patterns

## Prevention Strategies

1. **Code Review**: Always review code for these common issues
2. **Testing**: Include tests that catch these error patterns
3. **Linting**: Use appropriate linting tools to catch issues early
4. **Documentation**: Document patterns to avoid for future reference

---
NOTE TO AI: Always check for these common errors before suggesting or implementing code changes.
`;
  }

  /**
   * Gets default MCP configuration template
   * @returns {string} Default template content
   */
  getDefaultMcpConfigTemplate() {
    return `---
description: Model Context Protocol (MCP) server configuration and capabilities
globs:
alwaysApply: false
version: "2.1.0"
lastUpdated: "{{date}}"
compatibleWith: ["MCP-Integration", "AI-Tools"]
---

# MCP Server Configuration

## Available MCP Servers

This project may use Model Context Protocol (MCP) servers to enhance AI capabilities.

### Configuration Locations

Different editors and AI tools store MCP configurations in different locations:

- **Cursor**: \`.cursor/mcp.json\` or global config
- **Claude Desktop**: \`~/Library/Application Support/Claude/claude_desktop_config.json\`
- **VS Code**: \`.vscode/mcp.json\`
- **Generic**: \`.ai/mcp.json\`

### Common MCP Servers

#### Memory Management
- **Purpose**: Persistent memory across sessions
- **Capabilities**: Note-taking, context preservation, session handoff

#### File Operations
- **Purpose**: Enhanced file system operations
- **Capabilities**: Advanced file search, content analysis, batch operations

#### Development Tools
- **Purpose**: Development-specific utilities
- **Capabilities**: Code analysis, testing utilities, deployment tools

## Integration Guidelines

When working with MCP servers:
1. Check available server capabilities before suggesting features
2. Use appropriate MCP commands for enhanced functionality
3. Document MCP server dependencies for project setup
4. Consider fallback options when MCP servers are unavailable

---
NOTE TO AI: Check for available MCP servers and use their capabilities when appropriate.
`;
  }
}