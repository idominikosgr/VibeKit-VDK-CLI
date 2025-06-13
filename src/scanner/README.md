<div align="center">

# 🔍 Project Scanner

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/idominikosgr/Vibe-Coding-Rules)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](https://github.com/idominikosgr/Vibe-Coding-Rules)

**Automatically analyzes codebases to generate custom Vibe Coding Rules tailored to your project**

</div>

## 🎯 Purpose

The Project Scanner is a powerful tool designed to automatically generate project-specific rule files for the Vibe Coding Rules framework. It detects patterns, naming conventions, architecture, and technology stacks to create customized AI assistance rules.

## 📋 Overview

The Project Scanner is an intelligent utility that analyzes your codebase to automatically generate project-specific rule files for the Vibe Coding Rules framework. It detects patterns, naming conventions, architecture, and technology stacks to create customized AI assistance rules.

## ✨ Features

- 🚀 **Project Structure Analysis**: Scans your entire codebase to understand directory organization and file relationships
- 🧮 **Naming Convention Detection**: Identifies consistent patterns in variable, function, and class naming
- 🏗️ **Architecture Pattern Recognition**: Detects common architectural patterns like MVC, MVVM, etc.
- 📚 **Technology Stack Identification**: Automatically identifies frameworks and libraries in use
- 🔎 **Anti-Pattern Detection**: Finds potential code smells and inconsistencies
- 📝 **Rule Generation**: Creates custom `.mdc` files with minimal manual input

## 🚀 Installation

The scanner is included with Vibe Coding Rules and requires no separate installation:

```bash
# From the Vibe Coding Rules root directory
npm install
```

## 📊 Usage

### Via CLI Command

```bash
# Basic usage - scans the current directory
npm run scan

# Scan a specific project directory
npm run scan -- --path /path/to/your/project

# Advanced usage with all options
npm run scan -- --path /path/to/your/project --output /custom/output/path --deep --ignorePattern "**/node_modules/**" --verbose
```

### Via Setup Wizard

```bash
# Interactive setup with scanner integration
npm run wizard
```

### Available Options

| Option | Description |
|--------|-------------|
| `--path`, `-p` | Path to the project to scan (default: current directory) |
| `--output`, `-o` | Path where generated rules should be saved (default: `./.ai/rules`) |
| `--deep`, `-d` | Enable deep scanning for more thorough pattern detection |
| `--ignorePattern`, `-i` | Glob patterns to ignore (can be used multiple times) |
| `--verbose`, `-v` | Enable verbose output for debugging |
| `--help`, `-h` | Display help information |

## 🧩 How It Works

1. **Project Scanning**: Traverses the entire project directory structure
2. **Pattern Detection**: Analyzes code for consistent patterns and naming conventions
3. **Dependency Analysis**: Examines package files to determine technology stack
4. **Architecture Recognition**: Identifies architectural patterns based on file organization and relationships
5. **Rule Generation**: Creates a customized rule file based on the analysis
6. **Validation**: Verifies the generated rules for correctness and conflicts

## 🧠 Implementation Details

The Project Scanner is built with a modular architecture designed for extensibility and maintainability:

### Core Components

- **ProjectScanner**: Traverses project directories and builds a comprehensive structure model
- **PatternDetector**: Analyzes code to identify naming conventions and architectural patterns
- **TechnologyAnalyzer**: Identifies frameworks, libraries, and tech stack components
- **RuleGenerator**: Creates customized rule files based on templates and analysis results

### Language Analyzers

The scanner includes specialized analyzers for multiple languages:

- **JavaScript/TypeScript**: Detects React components, modern syntax usage, frameworks
- **Python**: Identifies frameworks like Django/Flask, OOP vs. functional patterns
- **Swift**: Recognizes SwiftUI, Combine, and iOS/macOS patterns
- **Additional Languages**: Expandable system for adding more language analyzers

### Template System

The rule generation uses a flexible Handlebars template system:

- **Project Context**: Creates `01-project-context.mdc` with project-specific details
- **Language Rules**: Generates language-specific best practices files
- **Framework Rules**: Creates framework-specific guidance for detected frameworks

## 🔄 Integration with Vibe Coding Rules

This tool integrates seamlessly with the Vibe Coding Rules framework:

1. **Initial Project Setup**: Run the scanner when setting up Vibe Coding Rules for a new project
2. **Rule Customization**: Review and refine the auto-generated rules for your specific needs
3. **IDE Integration**: Generated rules are placed in the correct location for IDE plugins

## 📅 Roadmap

Future enhancements planned for the Project Scanner:

- **Additional Language Support**: Add analyzers for more languages (Ruby, Go, etc.)
- **IDE Plugin Integration**: Direct integration with Code Editor plugins
- **Rule Validation System**: Improved verification of generated rules
- **Interactive UI**: Web-based interface for rule customization

## 🤝 Contributing

Contributions are welcome! Please check the [CONTRIBUTING.md](../../CONTRIBUTING.md) file for guidelines.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/idominikosgr/Vibe-Coding-Rules.git
cd Vibe-Coding-Rules

# Install dependencies
npm install

# Run the scanner in development mode
npm run scan -- --verbose
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [Vibe Coding Rules Team](https://github.com/idominikosgr/Vibe-Coding-Rules)**

</div>
