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
3. Check the [Issues](https://github.com/idominikosgr/CodePilotRules/issues) for open tasks or create a new issue to discuss your proposed changes

## Development Setup

```bash
# Clone the repository
git clone https://github.com/idominikosgr/CodePilotRules.git
cd CodePilotRules

# Install dependencies for the project scanner
cd tools/project-scanner
npm install

# Run tests to ensure everything is working
npm test
```

## Testing Guidelines

We maintain a comprehensive test suite to ensure the reliability and functionality of Vibe Coding Rules. Please follow these guidelines when writing tests:

### Test Coverage Requirements

- All new features must include tests with at least 70% code coverage
- Bug fixes must include tests that reproduce and confirm the fix
- Core components require both unit and integration tests

### Test Structure

Organize tests by module and functionality:

```
src/__tests__/
  core/              # Tests for core components
    ComponentName.test.js
  utils/             # Tests for utility functions
    UtilityName.test.js
  analyzers/         # Tests for language analyzers
    LanguageName.test.js
  fixtures/          # Test fixtures and mock data
    test-project/    # Sample project structures
```

### Writing Tests

Follow these principles when writing tests:

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Clear Descriptions**: Use descriptive test names that explain the expected behavior
3. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification phases
4. **Mock External Dependencies**: Use Jest mocks for file system operations, network calls, etc.
5. **Test Edge Cases**: Include tests for error conditions and boundary cases

Example test:

```javascript
describe('ComponentName', () => {
  // Setup before tests
  beforeEach(() => {
    // Initialize test environment
  });

  describe('methodName', () => {
    test('should handle normal input correctly', () => {
      // Arrange
      const input = 'test input';
      const expected = 'expected result';

      // Act
      const result = component.methodName(input);

      // Assert
      expect(result).toBe(expected);
    });

    test('should handle edge cases', () => {
      expect(() => {
        component.methodName(null);
      }).toThrow('Invalid input');
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific file
npm test -- -t "ComponentName"

# Run tests with watch mode (useful during development)
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

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
3. **Write Tests**: Add tests for your changes with adequate coverage
4. **Follow Code Style**: Ensure your code follows the project's style guidelines
5. **Run Tests**: Make sure all tests pass before submitting your PR
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
Describe tests added and how existing functionality was verified.

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

1. Create a new file in `tools/project-scanner/src/analyzers/[language].js`
2. Implement the required analyzer interface:
   - `analyzeCode(code)`: Analyze code content
   - `analyzeFile(filePath)`: Analyze a file
   - `analyzeNamingConventions(files)`: Detect naming conventions
3. Add language-specific rule templates in `tools/project-scanner/src/templates/languages/`
4. Update the `TechnologyAnalyzer` to detect the new language
5. Add tests for your analyzer in `tools/project-scanner/src/__tests__/analyzers/`

### Creating New Rule Files

All new rule files (.mdc) must follow the standardized template format:

1. Use the `templates/standardized-rule-template.mdc` as your starting point
2. Include all required metadata fields (description, version, lastUpdated)
3. Follow the 8-section format outlined in the template
4. Place your rule file in the appropriate directory (.ai/rules/[category]/)

Thank you for contributing to Vibe Coding Rules!
