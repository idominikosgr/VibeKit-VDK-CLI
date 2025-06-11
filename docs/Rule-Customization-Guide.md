# Vibe Coding Rules - Rule Customization User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Understanding .mdc Files](#understanding-mdc-files)
3. [Rule Syntax Reference](#rule-syntax-reference)
4. [Creating Custom Rules](#creating-custom-rules)
5. [Rule Templating with Handlebars](#rule-templating-with-handlebars)
6. [Best Practices](#best-practices)
7. [Example Rules](#example-rules)
8. [Troubleshooting](#troubleshooting)

## Introduction

Vibe Coding Rules uses Markdown Customization (.mdc) files to provide context-aware guidance to AI coding assistants. These files follow a specific format designed to be both human-readable and easily parseable by AI systems. This guide will walk you through the structure of .mdc files, how to create your own rules, and best practices for effective rule customization.

## Understanding .mdc Files

### What are .mdc Files?

MDC (Markdown Customization) files are special Markdown files that contain structured instructions for AI coding assistants. They use a combination of Markdown formatting and specific metadata sections to define how an AI tool should behave when assisting with your project.

### File Structure

Each .mdc file typically consists of:
- A metadata header with key information about the rule
- Sections that define specific behaviors, preferences, or knowledge
- Examples to illustrate correct implementation

### Rule Loading Order

Rules are loaded in alphabetical order by default, which is why we prefix rule files with numbers (e.g., `00-core-agent.mdc`, `01-project-context.mdc`). This ensures that more foundational rules are processed first and can be referenced or modified by later rules.

## Rule Syntax Reference

### Metadata Header

Each rule file starts with a metadata section in the following format:

```md
---
name: "Rule Name"
description: "Short description of what this rule does"
version: "1.0"
author: "Your Name"
date: "YYYY-MM-DD"
priority: 100
tags: ["tag1", "tag2"]
platforms: ["cursor", "vscode", "github-copilot", "claude", "windsurf", "jetbrains", "zed"]
---
```

Fields explanation:
- `name`: A concise, descriptive name for the rule
- `description`: A brief explanation of what the rule does
- `version`: Rule version number (semantic versioning recommended)
- `author`: Rule creator's name or organization
- `date`: Creation or last updated date (YYYY-MM-DD format)
- `priority`: Numeric priority value (higher numbers = higher priority)
- `tags`: Array of keywords for categorizing the rule
- `platforms`: Array of AI platforms where this rule applies

### Directive Sections

MDC files use specially formatted sections to define different aspects of AI behavior. Typical directive sections include:

#### Agent Persona

```md
## Agent Persona

You are a professional software developer with expertise in [technology].
Always provide solutions that follow best practices for [technology].
```

#### Knowledge Context

```md
## Knowledge Context

This project uses the following tech stack:
- Framework: [framework]
- Languages: [languages]
- Database: [database]
```

#### Implementation Preferences

```md
## Implementation Preferences

- Always use async/await instead of callbacks or Promises
- Prefer functional components over class components
- Use descriptive variable names following camelCase convention
```

#### Code Examples

```md
## Code Examples

### Component Example
```jsx
function ExampleComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // Effect logic here
  }, [dependencies]);

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

## Creating Custom Rules

### Rule Creation Process

1. **Identify the Need**: Determine what specific guidance or context your AI assistant requires
2. **Choose the Right Level**: Decide whether this should be a project-wide rule or specific to a particular technology/component
3. **Create the File**: Place your new .mdc file in the appropriate directory with a descriptive name
4. **Define Metadata**: Add the required metadata header
5. **Add Directive Sections**: Include relevant sections based on the rule's purpose
6. **Test the Rule**: Ensure the AI tool correctly interprets and applies your rule

### Rule Placement

Rules should be organized in a logical directory structure to make them easy to find and maintain:

```
.ai/
  rules/
    00-core-agent.mdc           # Core agent behavior
    01-project-context.mdc       # Project-wide context
    02-common-errors.mdc         # Common errors and solutions
    03-mcp-configuration.mdc     # MCP server configuration
    languages/                   # Language-specific rules
      TypeScript-Modern.mdc
      Python3.mdc
    technologies/                # Framework/technology-specific rules
      NextJS.mdc
      Django.mdc
    patterns/                    # Architectural pattern rules
      MVC.mdc
      MVVM.mdc
```

## Rule Templating with Handlebars

Vibe Coding Rules uses Handlebars templates to dynamically generate rule files based on project analysis. When creating custom templates, you can use the following Handlebars features:

### Variables

Access data using double curly braces:
```
{{projectName}}
{{date}}
{{frameworks}}
```

### Conditionals

Use if/else blocks to include content conditionally:
```
{{#if usingTypeScript}}
## TypeScript Configuration
(TypeScript-specific guidance)
{{else}}
## JavaScript Configuration
(JavaScript-specific guidance)
{{/if}}
```

### Loops

Iterate over arrays:
```
## Frameworks Used

{{#each frameworks}}
- {{this}}
{{/each}}
```

### Helper Functions

Use custom helper functions for more complex transformations:
```
{{#capitalize projectName}}{{/capitalize}}
{{#join libraries ", "}}{{/join}}
```

## Best Practices

### Rule Writing Best Practices

1. **Be Specific**: Provide clear, actionable guidance rather than vague suggestions
2. **Prioritize Consistency**: Ensure rules don't contradict each other
3. **Include Examples**: Whenever possible, include examples of correct implementation
4. **Keep Rules DRY**: Don't duplicate information across multiple rule files
5. **Use Hierarchical Structure**: Start with general rules and get more specific
6. **Maintain Documentation**: Add comments to explain complex rules

### Rule Organization

1. **Logical Grouping**: Group related rules together
2. **Progressive Disclosure**: Start with foundational rules before specialized ones
3. **Naming Convention**: Use consistent, descriptive names for rule files
4. **Version Control**: Keep rules in version control alongside your project code
5. **Rule Testing**: Validate that rules produce the desired AI behavior

## Example Rules

### Basic Project Context Rule

```md
---
name: "Project Context"
description: "Provides basic information about the project structure and technology stack"
version: "1.0"
author: "Your Name"
date: "2025-05-16"
priority: 90
tags: ["context", "project-info"]
platforms: ["cursor", "vscode", "github-copilot", "claude", "windsurf", "jetbrains", "zed"]
---

## Project Overview

This project is a web application built with {{framework}}. It follows {{architecturalPattern}} architecture pattern and uses {{primaryLanguage}} as its main programming language.

## Key Directories

- `src/` - Contains the source code
- `tests/` - Contains test files
- `public/` - Static assets
- `docs/` - Project documentation

## Important Files

- `package.json` - Dependency management
- `tsconfig.json` - TypeScript configuration
- `README.md` - Project README
```

### Framework-Specific Rule (NextJS Example)

```md
---
name: "Next.js Conventions"
description: "Defines best practices and conventions specific to Next.js development"
version: "1.0"
author: "Your Name"
date: "2025-05-16"
priority: 70
tags: ["nextjs", "frontend"]
platforms: ["cursor", "vscode", "github-copilot", "claude", "windsurf", "jetbrains", "zed"]
---

## Next.js Development Guidelines

### Application Structure

- Pages are stored in `src/app` or `src/pages` directory
- Components are stored in `src/components`
- API routes are stored in `src/app/api` or `src/pages/api`

### Routing

- Use built-in Next.js routing methods
- Prefer dynamic routes using `[param]` syntax for variable paths

### Data Fetching

- Use server components with React Server Components (RSC) for static data
- Use server actions for forms and mutations
- Use client components with `'use client'` directive for interactive content

### Code Examples

#### Server Component Example

```tsx
// src/app/users/page.tsx
async function UsersPage() {
  const users = await fetchUsers();

  return (
    <main>
      <h1>Users</h1>
      <UserList users={users} />
    </main>
  );
}

export default UsersPage;
```

#### Client Component Example

```tsx
// src/components/user-form.tsx
'use client';

import { useState } from 'react';

export default function UserForm({ onSubmit }) {
  const [name, setName] = useState('');

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit({ name });
    }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="User name"
      />
      <button type="submit">Create User</button>
    </form>
  );
}
```
```

## Troubleshooting

### Common Issues

1. **Rules Not Being Applied**
   - Check if the file extension is `.mdc`
   - Verify the file is in the correct location (typically `.ai/rules/`)
   - Ensure proper metadata header format
   - Check if the AI tool supports Vibe Coding Rules

2. **Conflicting Rules**
   - Rules with higher priority values take precedence
   - More specific rules (e.g., technology-specific) override general rules
   - Check for contradictory directives across different rule files

3. **Syntax Errors**
   - Validate proper Markdown formatting
   - Check that code examples are properly fenced with triple backticks
   - Ensure metadata is formatted correctly with proper YAML syntax

### Getting Help

If you encounter issues with your rules, try:
1. Validating rule syntax with the project-scanner validation tool
2. Checking the documentation at https://github.com/yourusername/VibeCodingRules
3. Joining the community Discord for assistance

## Conclusion

Customizing Vibe Coding Rules with .mdc files gives you fine-grained control over how AI assistants help with your project. By following this guide and adhering to best practices, you can create rules that significantly improve your development workflow.

Remember that the goal of custom rules is to communicate essential context, preferences, and knowledge to the AI system that it wouldn't otherwise have. Focus on the aspects of your project that are most important to maintain consistency and quality in the code.
