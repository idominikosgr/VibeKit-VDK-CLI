<div align="center">

# 📚 Project Scanner Documentation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-0.1.0-green.svg)](https://github.com/idominikosgr/CodePilotRules)
[![Last Updated](https://img.shields.io/badge/Last%20Updated-May%202025-brightgreen)](https://github.com/idominikosgr/CodePilotRules)

**Complete reference guide for the Vibe Coding Rules Project Scanner tool**

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Installation](#-installation)
- [Command Line Options](#-command-line-options)
- [Core Components](#-core-components)
- [Rule Generation](#-rule-generation)
- [Rule Validation](#-rule-validation)
- [IDE Integration](#-ide-integration)
- [Example Workflows](#-example-workflows)
- [Troubleshooting](#-troubleshooting)
- [API Reference](#-api-reference)

## 🔍 Overview

The Project Scanner is a sophisticated tool designed to automatically generate project-specific rule files for the Vibe Coding Rules framework. It examines your project structure, coding patterns, and technology stack to create customized AI assistance rules tailored to your specific project.

### Key Features

- **Project Structure Analysis**: Traverses your entire codebase to understand directory organization and file relationships
- **Naming Convention Detection**: Identifies consistent patterns in variable, function, and class naming
- **Architecture Pattern Recognition**: Detects common architectural patterns like MVC, MVVM, etc.
- **Technology Stack Identification**: Automatically identifies frameworks and libraries in use
- **Anti-Pattern Detection**: Finds potential code smells and inconsistencies
- **Rule Validation**: Ensures generated rules are valid and useful
- **IDE Integration**: Works with various IDE plugins for real-time rule updates

## 🚀 Installation

The Project Scanner is included in the Vibe Coding Rules repository. To set it up:

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/idominikosgr/CodePilotRules.git
cd CodePilotRules

# Install dependencies for the project scanner
cd tools/project-scanner
npm install
```

## 🖵️ Command Line Options

The Project Scanner provides a variety of command-line options for customizing its behavior:

```bash
# Basic usage
node src/index.js --path /path/to/your/project

# Full usage with all options
node src/index.js \
  --path /path/to/your/project \
  --output /custom/output/path \
  --deep \
  --ignorePattern "**/node_modules/**" "**/dist/**" \
  --verbose \
  --ide-integration \
  --watch
```

### Available Options

| Option | Short | Description |
|--------|-------|-------------|
| `--path` | `-p` | Path to the project to scan (default: current directory) |
| `--output` | `-o` | Path where generated rules should be saved (default: `./.ai/rules`) |
| `--deep` | `-d` | Enable deep scanning for more thorough pattern detection |
| `--ignorePattern` | `-i` | Glob patterns to ignore (can be used multiple times) |
| `--verbose` | `-v` | Enable verbose output for debugging |
| `--skip-validation` | | Skip validation of generated rule files |
| `--strict` | | Enable strict mode for rule validation |
| `--ide-integration` | | Enable IDE integration for rule updates |
| `--watch` | | Watch for project changes and regenerate rules automatically |

## 🧩 Core Components

The Project Scanner is built with a modular architecture designed for extensibility:

### ProjectScanner

The core component that traverses the project directory structure and collects information about files and their relationships.

```javascript
const scanner = new ProjectScanner(options);
const projectStructure = await scanner.scanProject('/path/to/project');
```

### PatternDetector

Analyzes code to detect naming conventions, architectural patterns, and common coding styles.

```javascript
const patternDetector = new PatternDetector(options);
const patterns = await patternDetector.detectPatterns(projectStructure);
```

### TechnologyAnalyzer

Identifies the technology stack, frameworks, and libraries used in the project.

```javascript
const techAnalyzer = new TechnologyAnalyzer(options);
const techStack = await techAnalyzer.analyzeTechnologies(projectStructure);
```

### RuleGenerator

Generates custom rule files based on templates and analysis results.

```javascript
const ruleGenerator = new RuleGenerator(options);
const generatedFiles = await ruleGenerator.generateRules({
  projectStructure,
  patterns,
  techStack
});
```

## 📝 Rule Generation

The Project Scanner generates several types of rule files:

### Project Context Rules

The `01-project-context.mdc` file contains project-specific information, including:

- Project overview and purpose
- Directory structure and organization
- Naming conventions and coding standards
- Key components and their relationships
- Development workflow guidelines

### Language-Specific Rules

Rules tailored to the primary programming language(s) used in the project:

- Best practices for the language
- Commonly used patterns and idioms
- Language-specific pitfalls to avoid
- Testing and documentation standards

### Framework-Specific Rules

Rules for the frameworks and libraries used in the project:

- Framework architecture patterns
- Component organization and naming
- State management approaches
- Performance optimization techniques

## ✅ Rule Validation

The Project Scanner includes a validation system to ensure generated rules are valid and useful:

### Validation Checks

- **Front Matter Validation**: Ensures required metadata fields are present
- **Content Validation**: Checks for required sections and content quality
- **Placeholder Detection**: Identifies placeholder content that wasn't properly replaced
- **Conflict Detection**: Finds conflicts between different rule files

### Validation Results

Validation results include:

- Overall success/failure status
- Detailed list of errors and warnings
- Suggestions for fixing issues
- Quality metrics for generated rules

```bash
# Run validation on existing rules
node src/index.js --path /path/to/project --skip-generation --strict
```

## 🔌 IDE Integration

The Project Scanner can integrate with various IDE plugins to provide real-time rule updates:

### Supported IDEs

- **VS Code**: Integration with VS Code extensions
- **Cursor**: Direct integration with Cursor AI
- **JetBrains IDEs**: Support for IntelliJ, WebStorm, and other JetBrains IDEs
- **Windsurf**: Integration with Windsurf AI

### Watch Mode

Watch mode enables the scanner to monitor your project for changes and automatically update rules:

```bash
# Enable watch mode with IDE integration
node src/index.js --path /path/to/project --ide-integration --watch
```

### IDE-Specific Rule Paths

The scanner automatically detects IDE configurations and generates rules in the appropriate locations:

- VS Code: `.vscode/ai-rules/`
- Cursor: `.cursor/rules/`
- JetBrains: `.idea/ai-rules/`
- Windsurf: `.windsurf/rules/`
- Generic: `.ai/rules/`

## 📊 Example Workflows

### Basic Scanning

```bash
# Scan the current project with default settings
cd your-project
node /path/to/codepilot/tools/project-scanner/src/index.js
```

### Advanced Configuration

```bash
# Scan a specific project with custom options
node src/index.js \
  --path /path/to/complex-project \
  --deep \
  --ignorePattern "**/generated/**" "**/vendor/**" \
  --verbose
```

### IDE Integration

```bash
# Scan and set up IDE integration with watch mode
node src/index.js \
  --path /path/to/project \
  --ide-integration \
  --watch
```

### CI/CD Integration

```bash
# Run in CI/CD pipeline with validation
node src/index.js \
  --path ${CI_PROJECT_DIR} \
  --strict \
  --output .ai/rules

# Check exit code for success/failure
if [ $? -eq 0 ]; then
  echo "Rule generation successful"
else
  echo "Rule generation failed"
  exit 1
fi
```

## 🔧 Troubleshooting

### Common Issues

#### Error: Cannot find module

```
Error: Cannot find module '/path/to/module'
```

**Solution**: Ensure all dependencies are installed by running `npm install` in the `tools/project-scanner` directory.

#### Error: Failed to parse file

```
Error: Failed to parse file: /path/to/file.js
```

**Solution**: The scanner might be having trouble with a specific file format or syntax. Try adding the file or directory to the ignore patterns.

#### Error: No rules generated

```
Warning: No rules were generated
```

**Solution**: Check that the project contains enough code for analysis. Very small projects might not have enough patterns to detect.

### Getting Help

For additional help:

- Run with `--verbose` flag for detailed logs
- Check the GitHub repository for known issues
- Contact the Vibe Coding Rules maintainers for support

## 📗 API Reference

For developers looking to extend or integrate the Project Scanner:

### Module Structure

```
/src
  /core            # Core scanning and analysis components
  /analyzers       # Language-specific analyzers
  /templates       # Rule templates
  /utils           # Utility functions
  /integrations    # IDE integrations
  index.js         # Main entry point
```

### Extension Points

- **Custom Analyzers**: Create new language analyzers in the `analyzers` directory
- **Custom Templates**: Add or modify templates in the `templates` directory
- **IDE Integrations**: Extend the IDE integration system in the `integrations` directory

### API Examples

```javascript
// Import the scanner programmatically
import { ProjectScanner, PatternDetector, TechnologyAnalyzer, RuleGenerator } from './src/index.js';

// Create a custom scanning workflow
async function customScan(projectPath) {
  const scanner = new ProjectScanner({ deep: true });
  const structure = await scanner.scanProject(projectPath);
  
  // Custom analysis logic here
  
  return structure;
}
```

---

<div align="center">

**Made with ❤️ by [Vibe Coding Rules Team](https://github.com/idominikosgr/CodePilotRules)**

</div>
