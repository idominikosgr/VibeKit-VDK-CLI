# Rule Authoring Guide

This guide outlines the process for creating, testing, and contributing rules to the Vibe Coding Rules repository.

## Table of Contents

- [Rule Format](#rule-format)
- [Metadata Fields](#metadata-fields)
- [Rule Content](#rule-content)
- [Examples and Best Practices](#examples-and-best-practices)
- [Testing Your Rules](#testing-your-rules)
- [Contributing Rules](#contributing-rules)

## Rule Format

Vibe Coding Rules uses the MDC (Markdown Configuration) format, which combines structured metadata with Markdown content. Each rule is stored as a `.mdc` file with the following structure:

```markdown
---
title: "Descriptive Title for the Rule"
description: "A brief description of what the rule does and when to use it"
version: "1.0.0"
author: "Your Name"
lastUpdated: "2025-05-20"
tags: ["tag1", "tag2", "tag3"]
alwaysApply: false
globs: ["**/*.js", "**/*.ts"]
compatibleWith:
  ides: ["vscode", "intellij"]
  aiAssistants: ["copilot", "codewhisperer"]
  frameworks: ["react", "vue"]
examples:
  good:
    - "```js\n// Good example code\n```"
  bad:
    - "```js\n// Bad example code\n```"
---

# Rule Title

Introduction paragraph explaining the rule's purpose and when it should be applied.

## Context

Explain the context in which this rule is useful.

## Rule Details

Detailed explanation of the rule and how to follow it.

## Examples

### Good Examples

```javascript
// Good example code with comments explaining why it's good
```

### Bad Examples

```javascript
// Bad example code with comments explaining why it's problematic
```

## When to Use

Specific situations where this rule should be applied.

## Configuration

Any configuration options for this rule, if applicable.

## Related Rules

- [Related Rule 1](link-to-related-rule)
- [Related Rule 2](link-to-related-rule)
```

## Metadata Fields

The metadata section at the top of each rule file (between the `---` markers) is used for categorization, filtering, and integration with the Vibe Coding RulesHub. Here's an explanation of each field:

### Required Fields

- **`title`**: A descriptive title for the rule. Should be clear and concise.
- **`description`**: A brief summary of what the rule does and when to use it.
- **`version`**: Semantic versioning in the format `MAJOR.MINOR.PATCH`.

### Recommended Fields

- **`author`**: Your name or username.
- **`lastUpdated`**: Date when the rule was last updated in YYYY-MM-DD format.
- **`tags`**: Array of keywords related to the rule.
- **`globs`**: Array of file patterns this rule applies to, using [glob syntax](https://en.wikipedia.org/wiki/Glob_(programming)).
- **`compatibleWith`**: Object defining compatibility with:
  - `ides`: Array of compatible IDEs (e.g., "vscode", "intellij")
  - `aiAssistants`: Array of compatible AI assistants (e.g., "copilot", "codewhisperer")
  - `frameworks`: Array of compatible frameworks (e.g., "react", "vue")
- **`alwaysApply`**: Boolean indicating whether the rule should always be applied.
- **`examples`**: Object containing good and bad examples.

## Rule Content

After the metadata section, the rule content should be written in Markdown format. The content should include:

1. **Title**: The first heading should be the rule title
2. **Introduction**: Brief explanation of the rule
3. **Context**: When and why this rule is useful
4. **Rule Details**: Detailed explanation of the rule
5. **Examples**: Code examples showing good and bad practices
6. **When to Use**: Specific situations where the rule applies
7. **Configuration**: Any configuration options (if applicable)
8. **Related Rules**: Links to related rules

## Examples and Best Practices

### Naming

- Use kebab-case for filenames (e.g., `use-async-await.mdc`)
- Choose clear, descriptive names that indicate the rule's purpose
- Avoid generic names like "best-practice.mdc"

### Content

- Be specific and clear in your explanations
- Include both good and bad examples with comments
- Explain the reasoning behind the rule
- Keep examples concise but complete enough to demonstrate the point
- Include real-world scenarios where the rule is applicable

### Metadata

- Use proper semantic versioning:
  - Increment PATCH for minor changes and fixes
  - Increment MINOR for new features that are backward compatible
  - Increment MAJOR for breaking changes
- Include relevant tags to make the rule discoverable
- Be specific with glob patterns

## Testing Your Rules

Before submitting your rule, test it to ensure it works as expected:

1. Run the validation tool to check for errors:
   ```bash
   npm run validate-rules
   ```

2. Preview how your rule will appear in the hub:
   ```bash
   npm run preview-rule path/to/your-rule.mdc
   ```

3. Test the rule with an AI assistant to ensure it's clear and can be followed.

## Contributing Rules

To contribute a rule to the Vibe Coding Rules repository:

1. Fork the repository
2. Create a new branch for your rule
3. Add your rule file to the appropriate category directory
4. Validate your rule using the tool
5. Submit a pull request with a description of your rule

Your submitted rule will undergo review for:
- Adherence to the format
- Clarity and usefulness
- Technical accuracy
- Duplication (ensuring it doesn't duplicate an existing rule)

Once approved and merged, your rule will automatically be synchronized to the Vibe Coding RulesHub and available to users.
