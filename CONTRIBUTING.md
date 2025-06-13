# Contributing to Vibe Coding Rules

Thank you for considering contributing to Vibe Coding Rules! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Testing Guidelines](#testing-guidelines)
4. [Code Style](#code-style)
5. [Pull Request Process](#pull-request-process)
6. [Adding New Features](#adding-new-features)

## Getting Started

Before you begin contributing, please:

1. Familiarize yourself with the [Vibe Coding Rules documentation](./docs/)
2. Read our [Code of Conduct](./CODE_OF_CONDUCT.md)
3. Check the [Issues](https://github.com/idominikosgr/Vibe-Coding-Rules/issues) for open tasks or create a new issue to discuss your proposed changes

## Development Setup

```bash
# Clone the repository
git clone https://github.com/idominikosgr/Vibe-Coding-Rules.git
cd Vibe-Coding-Rules

# Install dependencies
npm install

# Run the CLI to verify installation
npm run setup
```

## Code Quality Guidelines

We maintain high code quality standards for Vibe Coding Rules. Please follow these guidelines:

### Development Standards

- All new features should be thoroughly tested manually
- Bug fixes should include verification that the issue is resolved
- Core components should be validated with the project scanner

### Manual Testing

Test your changes by:

1. **Running the CLI**: `npm run setup`
2. **Testing Project Scanning**: `npm run scan` on various project types
3. **Validating Rules**: `npm run validate` to ensure rule format compliance
4. **Checking CLI Commands**: Test all relevant CLI commands

## Code Style

We follow a consistent code style across the project:

- Use ESLint and follow the project's `.eslintrc` configuration
- Write clear, self-documenting code with meaningful variable and function names
- Include JSDoc comments for all public API functions
- Follow the existing project structure and patterns
- Use modern JavaScript features (ES modules, async/await, etc.)

## Pull Request Process

1. **Fork the Repository**: Create your own fork of the Vibe Coding Rules repository
2. **Create a Branch**: Make your changes in a new git branch based on the main branch
3. **Test Your Changes**: Manually test your changes using the CLI commands
4. **Follow Code Style**: Ensure your code follows the project's style guidelines
5. **Validate**: Run `npm run validate` to ensure everything works correctly
6. **Document Changes**: Update documentation as needed for your changes
7. **Submit PR**: Create a pull request with a clear title and description

### PR Description Template

```markdown
## Description
Brief description of the changes in this PR.

## Related Issue
Fixes #[issue number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
Describe manual testing performed and how existing functionality was verified.

## Documentation
Describe documentation updates made.

## Additional Notes
Any additional information that would be helpful for reviewers.
```

## Adding New Features

When adding new features to Vibe Coding Rules:

1. **Discuss First**: Create an issue to discuss your proposed feature before implementation
2. **Follow the Architecture**: Understand and follow the existing architecture and design patterns
3. **Documentation**: Update or create documentation for your feature
4. **Tests**: Write comprehensive tests for your feature
5. **Example Usage**: Include examples of how to use your feature

### Adding a New Language Analyzer

To add support for a new programming language:

1. Create a new file in `src/scanner/analyzers/[language].js`
2. Implement the required analyzer interface:
   - `analyzeCode(code)`: Analyze code content
   - `analyzeFile(filePath)`: Analyze a file
   - `analyzeNamingConventions(files)`: Detect naming conventions
3. Add language-specific rule templates in `src/scanner/templates/languages/`
4. Update the `TechnologyAnalyzer` to detect the new language
5. Test your analyzer manually with sample projects to ensure it works correctly

### Creating New Rule Files

All new rule files (.mdc) must follow the standardized template format:

1. Use the `templates/standardized-rule-template.mdc` as your starting point
2. Include all required metadata fields (description, version, lastUpdated)
3. Follow the 8-section format outlined in the template
4. Place your rule file in the appropriate directory (.ai/rules/[category]/)

Thank you for contributing to Vibe Coding Rules!
