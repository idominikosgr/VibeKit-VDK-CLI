# Project Scanner User Guide

<div align="center">

![Project Scanner Logo](https://raw.githubusercontent.com/idominikosgr/CodePilotRules/main/docs/assets/project-scanner-logo.png)

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)](https://github.com/idominikosgr/CodePilotRules)
[![Last Updated](https://img.shields.io/badge/Last%20Updated-May%202025-orange.svg)](https://github.com/idominikosgr/CodePilotRules)

*A powerful tool for analyzing project structures and generating customized coding rules*

</div>

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Installation](#-installation)
- [Basic Usage](#-basic-usage)
- [Advanced Options](#-advanced-options)
- [Templates](#-templates)
  - [Available Templates](#available-templates)
  - [Custom Templates](#custom-templates)
  - [Template Variables](#template-variables)
- [Rule Validation](#-rule-validation)
- [IDE Integration](#-ide-integration)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🚀 Introduction

Project Scanner is a tool designed to analyze your project's structure, detect frameworks, patterns, and architectural elements, and generate customized coding rules. These rules help maintain consistency, enforce best practices, and improve code quality across your codebase.

Key features include:

- **Automatic Framework Detection**: Identifies popular frameworks like React, Angular, Vue, Express, Django, and more
- **Architectural Pattern Recognition**: Detects common patterns like MVC, MVVM, Microservices
- **Customizable Templates**: Generate rules based on project-specific needs
- **Rule Validation**: Ensures generated rules are correct and consistent
- **IDE Integration**: Works with VSCode, JetBrains IDEs, and other editors

## 💻 Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- Git (for cloning the repository)

### Installation

Currently, the Project Scanner is not published to npm. You'll need to clone the repository and run it locally:

```bash
# Clone the repository
git clone https://github.com/idominikosgr/CodePilotRules.git

# Navigate to the project scanner directory
cd CodePilotRules/tools/project-scanner

# Install dependencies
npm install
```

## 🏁 Basic Usage

### Command Line Interface

Run the scanner on your project:

```bash
# From the project-scanner directory
node src/index.js /path/to/your/project

# Or with options
node src/index.js /path/to/your/project --output ./rules --templates project-context,react-modern
```

### Creating a Shell Alias (Optional)

For easier usage, you can create a shell alias in your `.bashrc`, `.zshrc`, or equivalent:

```bash
# Add this to your .bashrc or .zshrc
alias vibe-coding-rules-scan="node /path/to/CodePilotRules/tools/project-scanner/src/index.js"

# Then you can use
vibe-coding-rules-scan /path/to/your/project
```

### Configuration File

Create a `.codepilotrc.json` file in your project root to configure the scanner:

```json
{
  "outputDir": "./rules",
  "templates": ["project-context", "react-modern"],
  "validateRules": true,
  "strictMode": false,
  "ignorePatterns": ["node_modules/**", "dist/**", "build/**"]
}
```

### Via API

```javascript
// Import directly from the local project
import { scanProject } from './path/to/CodePilotRules/tools/project-scanner/src/index.js';

async function run() {
  try {
    const results = await scanProject({
      projectPath: '/path/to/your/project',
      outputDir: './rules',
      templates: ['project-context', 'react-modern'],
      validateRules: true
    });
    console.log('Generated rules:', results.generatedRules);
  } catch (error) {
    console.error('Error scanning project:', error);
  }
}

run();
```

**Note**: Since the package is currently not published to npm, you need to import it directly from the local file path where you have cloned the repository.

## 🔧 Advanced Options

### Command Line Options

| Option | Description |
|--------|-------------|
| `--output`, `-o` | Specify output directory for generated rules |
| `--templates`, `-t` | Comma-separated list of templates to use |
| `--no-validation` | Skip rule validation |
| `--strict` | Enable strict validation mode |
| `--watch`, `-w` | Watch mode - regenerate rules on file changes |
| `--ide-integration` | Enable IDE integration |
| `--verbose`, `-v` | Verbose output |
| `--config`, `-c` | Specify a configuration file path |

### Example Commands

**Generate rules with specific templates:**

```bash
node src/index.js ./ -t project-context,react-modern,typescript-modern
```

**Generate rules with custom output directory:**

```bash
node src/index.js ./ -o ./custom-rules-dir
```

**Enable watch mode for real-time rule updates:**

```bash
node src/index.js ./ --watch
```

**Skip validation for faster rule generation:**

```bash
node src/index.js ./ --no-validation
```

## 📝 Templates

### Available Templates

The Project Scanner comes with several built-in templates for common frameworks and languages:

#### Framework Templates

- **Angular-Modern**: Best practices for Angular applications
- **React-Modern**: Best practices for React applications
- **Vue-Modern**: Best practices for Vue.js applications
- **Node-Express**: Best practices for Node.js with Express
- **Django-Modern**: Best practices for Django applications

#### Architectural Pattern Templates

- **MVC**: Model-View-Controller pattern guidelines
- **MVVM**: Model-View-ViewModel pattern guidelines
- **Microservices**: Microservices architecture guidelines

#### Language Templates

- **JavaScript-Modern**: Best practices for modern JavaScript
- **TypeScript-Modern**: Best practices for TypeScript
- **Python-Modern**: Best practices for Python

#### General Templates

- **Project-Context**: General project information and structure
- **Security-Best-Practices**: Security guidelines for web applications
- **Performance-Optimization**: Performance optimization guidelines

### Custom Templates

Create custom templates in your project's `.codepilot/templates` directory. Templates use Handlebars syntax and can access various project metadata.

**Example Custom Template:**

```handlebars
---
description: "Custom rules for our team's code style"
globs: ["**/*.js", "**/*.ts"]
version: "1.0.0"
---

# {{projectName}} Code Style Guide

## Naming Conventions

- Use PascalCase for component names
- Use camelCase for variables and functions
- Use UPPER_SNAKE_CASE for constants

## Project Structure

```
{{projectStructure.overview}}
```

## {{techStack.frameworks.primary}} Best Practices

{{#if techStack.frameworks.primary}}
// Framework-specific best practices
{{/if}}
```

### Template Variables

The following variables are available in templates:

| Variable | Description |
|----------|-------------|
| `projectName` | The name of the project |
| `date` | Current date |
| `repositoryUrl` | URL of the Git repository |
| `techStack` | Detected technologies and frameworks |
| `complexity` | Project complexity assessment |
| `patterns` | Detected architectural patterns |
| `projectStructure` | Overview of the project's directory structure |
| `namingConventions` | Dominant naming conventions in the codebase |

**Example of accessing nested variables:**

```handlebars
{{#if techStack.frameworks.primary}}
  This project uses {{techStack.frameworks.primary}} as its primary framework.
{{else}}
  No primary framework detected.
{{/if}}

{{#if complexity.level}}
  {{#eq complexity.level "high"}}
    This is a high-complexity project.
  {{/eq}}
{{/if}}
```

## 🔍 Rule Validation

The Project Scanner includes a powerful validation system to ensure generated rules are correct, consistent, and useful. The validator checks for:

1. **Required Fields**: Ensures front matter contains all required fields
2. **Required Sections**: Verifies each rule type has necessary sections
3. **Empty Sections**: Detects and flags empty content
4. **Unreplaced Placeholders**: Finds templates variables that weren't replaced
5. **Conflicting Glob Patterns**: Checks for overlapping rules that might conflict

### Validation Levels

- **Standard Validation**: Catches common issues and errors
- **Strict Mode**: Enforces additional quality checks and formatting rules

### Disabling Validation

While not recommended, validation can be disabled for faster rule generation:

```bash
node src/index.js ./ --no-validation
```

## 🔌 IDE Integration

Project Scanner can integrate with popular IDEs to provide real-time rule updates and enhanced coding guidance.

### Supported IDEs

- **Visual Studio Code**: Via the CodePilot Rules extension
- **JetBrains IDEs**: IntelliJ IDEA, WebStorm, PyCharm via the CodePilot plugin
- **Sublime Text**: Through the CodePilot ST package

### Enabling IDE Integration

```bash
node src/index.js ./ --ide-integration
```

This will:

1. Detect your IDE configuration files
2. Set up the appropriate rule directories
3. Configure the IDE for real-time rule updates
4. Enable watch mode for rule regeneration on file changes

### Manual IDE Setup

If automatic integration fails, you can manually set up your IDE:

**VS Code**:
1. Install the CodePilot Rules extension
2. Set the rules directory in settings.json:
   ```json
   {
     "vibeCodingRules.rulesDir": "./rules"
   }
   ```

**JetBrains IDEs**:
1. Install the CodePilot plugin
2. Configure the rules directory in Settings → Tools → CodePilot Rules

## ❓ Troubleshooting

### Common Issues

**Rule generation fails with template error:**

Check your template syntax for errors. Make sure all Handlebars expressions are properly closed and that you're using valid Handlebars helpers.

**Validation reports too many false positives:**

Try disabling strict mode with `--strict false` or modify your template to address the validation warnings.

**IDE integration not working:**

Verify that your IDE is supported and that you have the necessary extensions/plugins installed. Check the permissions on your rules directory.

**Performance issues on large projects:**

Try limiting the templates used or exclude large directories using the `ignorePatterns` configuration option.

### Logging and Debugging

Enable verbose logging for more detailed output:

```bash
node src/index.js ./ --verbose
```

Examine log files in the `.codepilot/logs` directory for detailed information about the scanning process.

## 🤝 Contributing

We welcome contributions to the Project Scanner! Here's how you can help:

1. **Report Issues**: Open an issue for bugs or feature requests
2. **Improve Documentation**: Submit PRs for documentation updates
3. **Add Templates**: Create new templates for frameworks or patterns
4. **Fix Bugs**: Submit PRs with bug fixes
5. **Add Features**: Implement new features or enhancements

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

---

<div align="center">

**Project Scanner** • Part of the [Vibe Coding Rules](https://github.com/idominikosgr/CodePilotRules) project

MIT License • © 2025

</div>
