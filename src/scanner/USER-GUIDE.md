# Project Scanner User Guide

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)](https://github.com/idominikosgr/VibeKit-VDK-CLI)

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
- **IDE Integration**: Works with VSCode, Cursor, Windsurf, and other editors

## 💻 Installation

### Prerequisites

- Node.js (v18.x or higher)
- npm (v8.x or higher)

### Installation

The Project Scanner is included with VibeKit VDK CLI:

```bash
# Clone the repository
git clone https://github.com/idominikosgr/VibeKit-VDK-CLI.git
cd VibeKit-VDK-CLI

# Install dependencies
npm install
```

## 🏁 Basic Usage

### Command Line Interface

Run the scanner on your project:

```bash
# From the VibeKit-VDK-CLI directory
npm run scan

# Scan a specific project
npm run scan -- --path /path/to/your/project

# With options
npm run scan -- --path /path/to/your/project --output ./rules --deep --verbose
```

### Via Setup Wizard

The easiest way to use the scanner is through the interactive setup wizard:

```bash
npm run wizard
```

### Configuration File

Create a `.vibecodingrc.json` file in your project root to configure the scanner:

```json
{
  "outputDir": "./.ai/rules",
  "deep": true,
  "validateRules": true,
  "strictMode": false,
  "ignorePatterns": ["node_modules/**", "dist/**", "build/**"]
}
```

### Via API

```javascript
import { scanProject } from './src/scanner/index.js';

async function run() {
  try {
    const results = await scanProject({
      projectPath: '/path/to/your/project',
      outputDir: './.ai/rules',
      deep: true,
      validateRules: true
    });
    console.log('Generated rules:', results.generatedRules);
  } catch (error) {
    console.error('Error scanning project:', error);
  }
}

run();
```

## 🔧 Advanced Options

### Command Line Options

| Option | Description |
|--------|-------------|
| `--path`, `-p` | Specify path to scan (default: current directory) |
| `--output`, `-o` | Specify output directory for generated rules |
| `--deep`, `-d` | Enable deep scanning for thorough analysis |
| `--verbose`, `-v` | Enable verbose output |
| `--help`, `-h` | Display help information |

### Example Commands

**Generate rules with deep analysis:**

```bash
npm run scan -- --deep --verbose
```

**Generate rules with custom output directory:**

```bash
npm run scan -- -o ./custom-rules-dir
```

**Scan specific project path:**

```bash
npm run scan -- --path /path/to/project --output ./.ai/rules
```

## 📝 Templates

### Available Templates

The Project Scanner uses intelligent templates to generate rules based on detected technologies:

#### Framework Detection

- **React**: Detects React components, hooks, and patterns
- **Next.js**: Identifies Next.js specific patterns and file structure
- **Vue.js**: Recognizes Vue.js components and composition API usage
- **Angular**: Detects Angular services, components, and modules
- **Express.js**: Identifies Express.js routing and middleware patterns

#### Language Analysis

- **TypeScript**: Analyzes type definitions, interfaces, and advanced features
- **JavaScript**: Detects modern JavaScript patterns and ES6+ usage
- **Python**: Identifies Python frameworks and coding patterns

#### Architecture Patterns

- **Component Architecture**: Detects component-based patterns
- **MVC Pattern**: Identifies Model-View-Controller structures
- **API Patterns**: Recognizes REST and GraphQL implementations

### Custom Templates

You can extend the scanner with custom templates by adding them to the `src/scanner/templates/` directory.

### Template Variables

Templates use Handlebars syntax with project-specific variables:

- `{{projectName}}` - Project name
- `{{framework}}` - Detected primary framework
- `{{languages}}` - Array of detected languages
- `{{technologies}}` - Array of detected technologies

## ✅ Rule Validation

The scanner includes built-in validation to ensure generated rules are:

- **Syntactically correct** - Valid MDC format
- **Consistent** - No conflicting rules
- **Complete** - All required sections present

Enable validation:

```bash
npm run scan -- --validate
```

## 🔧 IDE Integration

Generated rules work automatically with supported IDEs:

- **VS Code**: Rules placed in `.vscode/rules/`
- **Cursor**: Rules placed in `.cursor/rules/`
- **Windsurf**: Rules placed in `.windsurf/rules/`
- **JetBrains**: Rules placed in `.idea/ai-rules/`

## 🔍 Troubleshooting

### Common Issues

**Issue**: Scanner not detecting frameworks
**Solution**: Ensure package.json and dependency files are present

**Issue**: Generated rules are too generic
**Solution**: Use `--deep` flag for more thorough analysis

**Issue**: Rules not appearing in IDE
**Solution**: Check IDE-specific rule directory locations

### Debug Mode

Enable verbose output for debugging:

```bash
npm run scan -- --verbose
```

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### Adding New Analyzers

1. Create analyzer in `src/scanner/analyzers/`
2. Register in `src/scanner/core/analyzer-registry.js`
3. Add corresponding templates
4. Update documentation

---

<div align="center">

**Part of [VibeKit VDK CLI](https://github.com/idominikosgr/VibeKit-VDK-CLI)**

</div>
