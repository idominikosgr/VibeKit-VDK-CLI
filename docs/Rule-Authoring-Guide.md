# 📝 Complete Rule Authoring & Customization Guide

This comprehensive guide covers everything you need to know about creating, customizing, and contributing VibeKit VDK CLI `.mdc` files. This is your complete reference for rule authoring.

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Understanding .mdc Files](#understanding-mdc-files)
3. [Rule Format & Metadata](#rule-format--metadata)
4. [Creating Custom Rules](#creating-custom-rules)
5. [Rule Templating with Handlebars](#rule-templating-with-handlebars)
6. [Best Practices & Guidelines](#best-practices--guidelines)
7. [Advanced Rule Features](#advanced-rule-features)
8. [Example Rules](#example-rules)
9. [Testing Your Rules](#testing-your-rules)
10. [Contributing Rules](#contributing-rules)
11. [Troubleshooting](#troubleshooting)

## Introduction

VibeKit VDK CLI uses **MDC (Markdown Customization)** files to provide context-aware guidance to AI coding assistants. These files follow a specific format designed to be both human-readable and easily parseable by AI systems.

### What are .mdc Files?

MDC files are special Markdown files that contain structured instructions for AI coding assistants. They combine:
- **YAML metadata header** with key information about the rule
- **Markdown sections** that define specific behaviors, preferences, or knowledge
- **Code examples** to illustrate correct implementation
- **Special directives** for AI-specific behavior

### Purpose

MDC files enhance AI assistants by providing:
- **Project-specific context** - Tech stack, conventions, patterns
- **Specialized workflows** - Task-specific guidance and procedures
- **Memory management** - Session continuity and decision tracking
- **Quality standards** - Best practices and anti-patterns

## Understanding .mdc Files

### Basic File Structure

Every `.mdc` file follows this structure:

```yaml
---
# YAML frontmatter (metadata)
title: "Descriptive Title for the Rule"
description: "Brief description of what the rule does and when to use it"
version: "1.0.0"
author: "Your Name"
lastUpdated: "2025-01-14"
tags: ["tag1", "tag2", "tag3"]
alwaysApply: false
globs: ["**/*.js", "**/*.ts"]
priority: 65
platforms: ["vscode", "cursor", "windsurf"]
---

# Rule Title

## 1. Role & Responsibility
Defines the AI assistant's role and primary responsibilities.

## 2. Core Principles
Fundamental principles and guidelines to follow.

## 3. Process & Methodology
Step-by-step processes and workflows.

## 4. Implementation Preferences
Specific coding patterns and preferences.

## 5. Code Examples
Practical examples demonstrating correct patterns.

## 6. Common Pitfalls & Mistakes
Issues to avoid and anti-patterns.

## 7. Response Format
How AI responses should be structured.

## 8. Configuration
Any configuration options or settings.
```

### File Extensions & Location

- **Extension**: `.mdc` (Markdown Customization)
- **Location**: `.ai/rules/` directory and subdirectories
- **Naming**: Use kebab-case (e.g., `use-async-await.mdc`)

### Rule Loading Order

Rules are loaded in alphabetical order by default, which is why we use numbered prefixes (e.g., `00-core-agent.mdc`, `01-project-context.mdc`). This ensures foundational rules are processed first and can be referenced by later rules.

## Rule Format & Metadata

### Required Metadata Fields

```yaml
---
title: "Descriptive Title for the Rule"
description: "Brief summary of what the rule does and when to use it (max 500 chars)"
version: "1.0.0"           # Semantic versioning
lastUpdated: "2025-01-14"  # ISO date format (YYYY-MM-DD)
---
```

### Optional Metadata Fields

```yaml
---
# Organization and discovery
author: "Your Name"
tags: ["javascript", "react", "components"]
priority: 65              # Loading priority (0-100, higher = more important)

# Activation and compatibility  
globs: ["**/*.tsx", "**/*.jsx"]        # File patterns for auto-activation
alwaysApply: false                     # Whether rule always applies (default: false)
platforms: ["vscode", "cursor"]       # Compatible IDEs/platforms

# Integration and relationships
compatibleWith: ["vibe-coding-rules-3.0+"]  # Version compatibility
dependencies: ["01-project-context.mdc"]     # Required rules

# Examples and validation
examples:
  good:
    - "```jsx\n// Good example\n<Component />\n```"
  bad:
    - "```jsx\n// Bad example\n<div />\n```"
---
```

### Metadata Field Specifications

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|-----------------|
| `title` | String | Yes | Descriptive rule name | Max 100 chars |
| `description` | String | Yes | Brief summary | Max 500 chars, required |
| `version` | String | Yes | Semantic versioning | Must follow SemVer (e.g., "2.1.0") |
| `lastUpdated` | String | Yes | ISO date format | YYYY-MM-DD format |
| `author` | String | No | Rule creator | Any string |
| `tags` | Array | No | Categorization keywords | String array |
| `globs` | Array | No | File patterns for activation | Valid glob patterns |
| `alwaysApply` | Boolean | No | Always consider this rule | true/false (default: false) |
| `priority` | Number | No | Loading order (0-100) | 0-100 range |
| `platforms` | Array | No | Compatible IDEs/platforms | String array |
| `compatibleWith` | Array | No | Version compatibility | Must reference valid versions |
| `dependencies` | Array | No | Required rules | Must reference valid rule files |

### Standard Directive Sections

Use these section headings for consistency:

```markdown
## 1. Role & Responsibility
Defines the AI assistant's role and primary responsibilities.

## 2. Core Principles  
Fundamental principles and guidelines to follow.

## 3. Process & Methodology
Step-by-step processes and workflows.

## 4. Implementation Preferences
Specific coding patterns and preferences.

## 5. Code Examples
Practical examples demonstrating correct patterns.

## 6. Common Pitfalls & Mistakes
Issues to avoid and anti-patterns.

## 7. Response Format
How AI responses should be structured.

## 8. Configuration
Any configuration options or settings.
```

## Creating Custom Rules

### Step-by-Step Creation Process

1. **Identify the Need**
   - Determine what specific guidance your AI assistant requires
   - Identify gaps in existing rule coverage
   - Consider project-specific patterns or requirements

2. **Choose the Right Scope**
   - **Project-wide rule**: General patterns affecting entire project
   - **Technology-specific**: Framework or language-specific guidance
   - **Task-specific**: Workflow or process-oriented rules

3. **Select File Location and Name**
   ```
   .ai/rules/
   ├── 00-core-agent.mdc           # Core behaviors (priority 90-100)
   ├── 01-project-context.mdc     # Project context (priority 80-89)
   ├── 02-common-errors.mdc       # Error patterns (priority 70-79)
   ├── languages/                 # Language rules (priority 60-69)
   │   ├── TypeScript-Modern.mdc
   │   └── Python3.mdc
   ├── technologies/              # Framework rules (priority 50-59)
   │   ├── React.mdc
   │   └── NextJS.mdc
   ├── tasks/                     # Task workflows (priority 40-49)
   │   ├── Code-Review.mdc
   │   └── Testing.mdc
   └── custom/                    # Custom rules (priority 0-39)
       └── project-specific.mdc
   ```

4. **Create the Rule File**
   - Use kebab-case for filenames (`use-async-await.mdc`)
   - Include proper metadata header
   - Add directive sections with clear guidance
   - Include practical examples

5. **Test and Iterate**
   - Test with your AI assistant
   - Refine based on AI behavior
   - Get feedback from team members

### Rule Creation Templates

#### Basic Rule Template

```yaml
---
title: "Your Rule Title"
description: "Clear description of what this rule does and when it applies"
version: "1.0.0"
author: "Your Name"
lastUpdated: "2025-01-14"
tags: ["relevant", "tags"]
globs: ["**/*.ext"]  # File patterns this applies to
alwaysApply: false
priority: 50
platforms: ["vscode", "cursor", "windsurf"]
---

# Your Rule Title

## 1. Role & Responsibility
Define what the AI should do when this rule is active.

## 2. Core Principles
- Key principle 1
- Key principle 2
- Key principle 3

## 3. Implementation Preferences
- Specific coding patterns to follow
- Tools and libraries to prefer
- Architectural decisions

## 4. Code Examples

### Good Examples
```language
// Example of correct implementation
const goodExample = 'follow this pattern';
```

### Bad Examples
```language
// Example of what to avoid
var badExample = 'avoid this pattern';
```

## 5. Common Pitfalls
- Common mistake 1 and how to avoid it
- Common mistake 2 and how to avoid it

## 6. Response Format
How the AI should structure its responses when this rule is active.
```

#### Task-Specific Rule Template

```yaml
---
title: "Task: Specific Workflow Name"
description: "Specialized workflow for [specific task] with step-by-step guidance"
version: "1.0.0"
author: "Your Name"
lastUpdated: "2025-01-14"
tags: ["task", "workflow", "specific-domain"]
globs: []  # Tasks are usually activated semantically
alwaysApply: false
priority: 45
---

# Task: Specific Workflow Name

## 1. Role & Responsibility
You are a specialized assistant for [specific task]. Your role is to:
- Primary responsibility 1
- Primary responsibility 2

## 2. Process & Methodology
1. **Step 1**: Description and action
2. **Step 2**: Description and action
3. **Step 3**: Description and action

## 3. Quality Standards
- Quality criterion 1
- Quality criterion 2
- Validation requirements

## 4. Tools & Integration
- Preferred tools for this task
- Integration patterns
- Automation opportunities

## 5. Examples
### Scenario 1
[Context and example]

### Scenario 2
[Context and example]

## 6. Common Issues
- Issue 1 and resolution
- Issue 2 and resolution

## 7. Return Protocol
After completing the task:
1. Summarize what was accomplished
2. Highlight any issues or concerns
3. Suggest next steps
```

## Rule Templating with Handlebars

VibeKit VDK CLI uses Handlebars templates to dynamically generate rule files based on project analysis. When creating custom templates, you can use the following Handlebars features:

### Variables

Access data using double curly braces:
```handlebars
{{projectName}}
{{date}}
{{frameworks}}
{{primaryLanguage}}
```

### Conditionals

Use if/else blocks to include content conditionally:
```handlebars
{{#if usingTypeScript}}
## TypeScript Configuration
Use strict TypeScript settings and proper typing.
{{else}}
## JavaScript Configuration
Follow ES6+ standards and use JSDoc for documentation.
{{/if}}
```

### Loops

Iterate over arrays:
```handlebars
## Detected Frameworks

{{#each frameworks}}
- **{{this.name}}**: {{this.description}}
{{/each}}
```

### Helper Functions

Use custom helper functions for more complex transformations:
```handlebars
{{#capitalize projectName}}{{/capitalize}}
{{#join libraries ", "}}{{/join}}
{{#formatDate lastUpdated}}{{/formatDate}}
```

### Template Example

```handlebars
---
title: "{{projectName}} Project Context"
description: "Project-specific patterns and conventions for {{projectName}}"
version: "1.0.0"
author: "{{author}}"
lastUpdated: "{{formatDate date}}"
tags: [{{#join tags '", "'}}{{/join}}]
---

# {{projectName}} Project Context

## 1. Project Overview
This is a {{projectType}} project using:
{{#each technologies}}
- **{{this.name}}** ({{this.version}})
{{/each}}

## 2. Architecture Patterns
{{#if architecture}}
The project follows {{architecture}} architecture with:
{{#each patterns}}
- {{this}}
{{/each}}
{{/if}}

## 3. Coding Conventions
{{#if namingConventions}}
### Naming Conventions
{{#each namingConventions}}
- **{{@key}}**: {{this}}
{{/each}}
{{/if}}
```

## Best Practices & Guidelines

### Rule Writing Best Practices

**Content Guidelines**
- **Be Specific**: Provide concrete examples rather than abstract principles
- **Stay Focused**: One rule per specific topic or workflow
- **Include Context**: Write assuming AI has limited project knowledge
- **Show Examples**: Demonstrate both good and bad patterns

**Structure Guidelines**
- Use clear headings (`#`, `##`, `###`) for organization
- Employ lists (`-`, `*`, `1.`) for actionable items
- Include code blocks with language specification
- Add examples demonstrating correct/incorrect patterns

**Writing Style**
- Write in active voice
- Use imperative mood for instructions
- Be concise but comprehensive
- Include rationale for complex decisions

### File Organization

**Directory Structure**
```
.ai/rules/
├── 00-core-agent.mdc           # Core AI behavior (priority 90-100)
├── 01-project-context.mdc     # Project-specific context (priority 80-89)
├── 02-common-errors.mdc       # Anti-patterns to avoid (priority 70-79)
├── 03-mcp-configuration.mdc   # MCP server configuration (priority 70)
├── languages/                 # Language-specific rules (priority 60-69)
│   ├── TypeScript-Modern.mdc
│   ├── Python3.mdc
│   └── JavaScript-ES6.mdc
├── technologies/              # Framework/technology rules (priority 50-59)
│   ├── React.mdc
│   ├── NextJS.mdc
│   └── Express.mdc
├── tasks/                     # Task-specific workflows (priority 40-49)
│   ├── Code-Review.mdc
│   ├── Testing.mdc
│   └── Debugging-Assistant.mdc
├── patterns/                  # Architectural patterns (priority 30-39)
│   ├── MVC.mdc
│   └── Component-Architecture.mdc
└── custom/                    # Project-specific custom rules (priority 0-29)
    ├── api-conventions.mdc
    └── team-standards.mdc
```

**Naming Conventions**
- Use kebab-case for filenames
- Include descriptive names
- Add version numbers for major revisions
- Use consistent prefixes for series

### File References

Reference other files using the `@` symbol:
```markdown
For project context, see @../01-project-context.mdc
For implementation details, see @./utils/DatabaseHelper.ts
Check the authentication patterns in @../technologies/NextAuth.mdc
```

## Advanced Rule Features

### Rule Activation Mechanisms

Rules can be activated through three mechanisms:

#### 1. Automatic (Glob Pattern Matching)
When active files match patterns in the `globs` field:
```yaml
globs: ["**/*.py", "**/requirements.txt", "**/pyproject.toml"]
```

#### 2. Semantic (Description Matching)  
AI selects rules based on `description` relevance to current task or context.

#### 3. Explicit (Direct Reference)
Users can explicitly invoke rules:
- Chat mention: `@tasks/Code-Quality-Review.mdc`
- Direct request: "Use the refactoring guidelines"

### Priority System

Rules are prioritized by:
1. **Priority value** (0-100, higher takes precedence)
2. **Specificity** (more specific rules override general ones)
3. **Loading order** (alphabetical within same priority)
4. **Dependencies** (dependent rules load after their dependencies)

### Special Directives

Special directives use specific syntax for machine-readable instructions:

```markdown
!directive[parameter]{value}
```

Examples:
```markdown
!priority[implementation_style]{high}
!ignore[file_pattern]{node_modules/**}
!reference[rule]{01-project-context.mdc}
!memory[context]{architectural_decisions}
```

### Rule Dependencies

Specify rule dependencies to ensure proper loading order:

```yaml
---
dependencies: ["01-project-context.mdc", "languages/TypeScript-Modern.mdc"]
---
```

## Example Rules

### Language-Specific Rule Example

```yaml
---
title: "Modern TypeScript Best Practices"
description: "TypeScript 5.0+ patterns, type safety, and modern feature usage"
version: "2.1.0"
author: "Development Team"
lastUpdated: "2025-01-14"
tags: ["typescript", "type-safety", "modern-js"]
globs: ["**/*.ts", "**/*.tsx", "**/tsconfig.json"]
alwaysApply: false
priority: 65
platforms: ["vscode", "cursor", "windsurf", "jetbrains"]
dependencies: ["01-project-context.mdc"]
---

# Modern TypeScript Best Practices

## 1. Role & Responsibility
You are a TypeScript expert focused on type safety, modern features, and best practices. Prioritize type correctness and developer experience.

## 2. Core Principles
- **Type Safety First**: Use strict TypeScript configuration
- **Explicit Types**: Prefer explicit types over `any`
- **Modern Features**: Use latest TypeScript features appropriately
- **Performance**: Consider compilation performance in type definitions

## 3. Implementation Preferences

### Type Definitions
- Use `interface` for object shapes that might be extended
- Use `type` for unions, intersections, and computed types
- Prefer `const assertions` for immutable data
- Use `satisfies` operator for type checking without widening

### Modern Patterns
```typescript
// Good: Using satisfies operator
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
} satisfies ApiConfig;

// Good: Const assertion for arrays
const statuses = ['pending', 'completed', 'failed'] as const;
type Status = typeof statuses[number];

// Good: Template literal types
type EventName<T extends string> = `on${Capitalize<T>}`;
```

## 4. Code Examples

### Good Examples
```typescript
// Interface for extensible objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Type for unions and computed types  
type UserAction = 'create' | 'update' | 'delete';
type UserEventHandler = (user: User, action: UserAction) => void;

// Generic function with constraints
function processItems<T extends { id: string }>(
  items: T[], 
  processor: (item: T) => T
): T[] {
  return items.map(processor);
}
```

### Bad Examples
```typescript
// Avoid: Using any
function processData(data: any): any {
  return data.someProperty;
}

// Avoid: Overly complex generic constraints
function complexFunction<
  T extends Record<string, unknown> & { 
    [K in keyof T]: T[K] extends string ? T[K] : never 
  }
>(arg: T): T {
  return arg;
}
```

## 5. Common Pitfalls
- **Overusing `any`**: Use `unknown` or proper types instead
- **Type assertions without validation**: Use type guards instead
- **Complex generic constraints**: Keep generics simple and readable
- **Ignoring strict mode**: Always use strict TypeScript configuration

## 6. Response Format
When providing TypeScript code:
1. Include proper type annotations
2. Explain type choices when complex
3. Suggest type improvements for existing code
4. Reference TypeScript version features when relevant
```

### Task-Specific Rule Example

```yaml
---
title: "Task: Code Quality Review"
description: "Comprehensive code review process with quality standards and best practices"
version: "1.3.0"
author: "Quality Team"
lastUpdated: "2025-01-14"
tags: ["task", "code-review", "quality", "best-practices"]
globs: []  # Activated semantically
alwaysApply: false
priority: 45
---

# Task: Code Quality Review

## 1. Role & Responsibility
You are a senior code reviewer conducting thorough quality assessments. Focus on:
- Code correctness and functionality
- Performance and efficiency
- Security vulnerabilities
- Maintainability and readability
- Adherence to project standards

## 2. Review Process & Methodology

### 1. Initial Assessment
- Understand the change context and purpose
- Identify the scope and impact of modifications
- Check for breaking changes

### 2. Code Analysis
- **Functionality**: Does the code work as intended?
- **Logic**: Is the implementation logical and efficient?
- **Edge Cases**: Are edge cases handled properly?
- **Error Handling**: Are errors caught and handled appropriately?

### 3. Quality Standards
- **Readability**: Is the code self-documenting?
- **Consistency**: Does it follow project conventions?
- **Performance**: Are there performance implications?
- **Security**: Are there security vulnerabilities?

### 4. Testing Assessment
- Are there adequate tests for new functionality?
- Do existing tests still pass?
- Is test coverage maintained or improved?

## 3. Review Checklist

### Code Structure
- [ ] Functions are focused and do one thing well
- [ ] Classes have clear responsibilities
- [ ] Code is properly organized and modular
- [ ] Dependencies are minimal and justified

### Implementation Quality
- [ ] Variable and function names are descriptive
- [ ] Comments explain why, not what
- [ ] Complex logic is broken down into simpler parts
- [ ] Code follows DRY (Don't Repeat Yourself) principle

### Performance & Efficiency
- [ ] No obvious performance bottlenecks
- [ ] Efficient algorithms and data structures used
- [ ] Memory usage is reasonable
- [ ] Database queries are optimized (if applicable)

### Security Considerations
- [ ] Input validation is present
- [ ] Output encoding prevents injection attacks
- [ ] Authentication and authorization are properly implemented
- [ ] Sensitive data is properly handled

## 4. Common Issues & Solutions

### Performance Issues
```typescript
// Bad: Inefficient nested loops
users.forEach(user => {
  orders.forEach(order => {
    if (order.userId === user.id) {
      // Process order
    }
  });
});

// Good: Use Map for O(1) lookups
const userOrderMap = new Map();
orders.forEach(order => {
  if (!userOrderMap.has(order.userId)) {
    userOrderMap.set(order.userId, []);
  }
  userOrderMap.get(order.userId).push(order);
});
```

### Security Issues
```javascript
// Bad: SQL Injection vulnerability
const query = `SELECT * FROM users WHERE id = ${userId}`;

// Good: Parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

## 5. Review Response Format

### Structure Your Review
1. **Summary**: Brief overview of changes and overall assessment
2. **Strengths**: Highlight good practices and improvements
3. **Issues**: List problems by severity (Critical, Major, Minor)
4. **Suggestions**: Provide constructive improvement suggestions
5. **Approval Status**: Clear indication of review outcome

### Example Review Response
```markdown
## Code Review Summary
**Overall Assessment**: Good implementation with minor improvements needed

### ✅ Strengths
- Clean, readable code structure
- Good error handling implementation
- Comprehensive test coverage

### 🔴 Critical Issues
- SQL injection vulnerability in user query (line 45)
- Missing input validation for API endpoint

### 🟡 Minor Suggestions  
- Consider extracting magic numbers to constants
- Add JSDoc comments for public methods
- Use more descriptive variable names in forEach callback

### Next Steps
1. Address critical security issues
2. Add input validation
3. Consider performance optimization for large datasets

**Status**: Request Changes - address critical issues before approval
```

## 6. Return Protocol
After completing the review:
1. Provide clear, actionable feedback
2. Prioritize issues by severity
3. Suggest specific improvements with examples
4. Indicate whether changes are required before approval
5. Offer to re-review after changes are made
```

## Testing Your Rules

### Manual Testing

Test your rules by:

1. **AI Interaction Testing**
   - Activate the rule and test AI responses
   - Verify the AI follows the guidance
   - Check if examples are understood correctly

2. **File Context Testing**
   - Test glob pattern matching
   - Verify activation with relevant files
   - Check priority and loading order

3. **Content Validation**
   - Ensure YAML frontmatter is valid
   - Verify all links and references work
   - Check code examples for syntax errors

### Automated Validation

Use the CLI validation tools:

```bash
# Validate rule format and syntax
npm run validate

# Check for rule conflicts
npm run check-duplicates

# Lint rule files
node cli.js lint .ai/rules/
```

### Testing Checklist

- [ ] YAML frontmatter is valid
- [ ] All required metadata fields are present
- [ ] Description is clear and under 500 characters
- [ ] Code examples have proper syntax highlighting
- [ ] File references use correct paths
- [ ] Rule activates in expected contexts
- [ ] AI assistant follows the guidance
- [ ] No conflicts with other rules

## Contributing Rules

### Community Contribution Process

1. **Fork the Repository**
   ```bash
   git clone https://github.com/idominikosgr/VibeKit-VDK-CLI.git
   cd VibeKit-VDK-CLI
   git checkout -b feature/new-rule-name
   ```

2. **Create Your Rule**
   - Follow the templates and guidelines above
   - Test thoroughly with multiple AI assistants
   - Document any special requirements

3. **Submit for Review**
   - Create a pull request with clear description
   - Include examples of the rule in action
   - Explain the use case and benefits

### Rule Quality Standards

All contributed rules must meet:
- **Completeness**: All required metadata and sections
- **Clarity**: Clear, actionable guidance
- **Testing**: Verified to work with major AI assistants
- **Uniqueness**: Doesn't duplicate existing rules
- **Quality**: Follows best practices and style guide

### Community Guidelines

- **Be Respectful**: Provide constructive feedback
- **Share Knowledge**: Document insights and learnings
- **Stay Current**: Keep rules updated with latest practices
- **Test Thoroughly**: Ensure rules work in real scenarios

## Troubleshooting

### Common Issues

**Rule Not Loading**
- Check file location (must be in `.ai/rules/`)
- Verify YAML frontmatter syntax
- Ensure required metadata fields are present

**AI Not Following Rule**
- Check rule description and content clarity
- Verify glob patterns match expected files
- Test rule priority and dependencies

**Syntax Errors**
- Validate YAML frontmatter online
- Check Markdown formatting
- Verify code block language specifications

**Performance Issues**
- Reduce rule complexity
- Optimize glob patterns
- Consider rule splitting for large files

### Getting Help

1. **Check Documentation**: Review this guide and related docs
2. **Validate Rules**: Use `npm run validate` command
3. **Community Support**: Ask in GitHub discussions
4. **Report Issues**: Create GitHub issues for bugs

---

**Need more help?** Check the [Troubleshooting Guide](Troubleshooting-Guide.md) or [CLI Reference](CLI-Reference.md) for additional resources.
