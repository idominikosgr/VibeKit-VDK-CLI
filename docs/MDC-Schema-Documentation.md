# VibeKit VDK CLI .mdc Schema Documentation

## Overview

This document provides a formal specification for the Markdown Customization (.mdc) file format used in VibeKit VDK CLI. The .mdc format is designed to provide structured guidance to AI coding assistants while maintaining human readability.

## File Structure

A valid .mdc file consists of:

1. A YAML metadata header (frontmatter)
2. A series of markdown sections containing directives
3. Optional code examples

## Schema Definition

### Metadata Header (Required)

The metadata header must be the first element in the file, enclosed by triple-dash `---` delimiters.

```yaml
---
description: "String (Required) - Comprehensive description of the rule's purpose"
globs: ["**/relevant/files/**", "**/*.{ext1,ext2,ext3}"] # Optional: File patterns this rule applies to
alwaysApply: false # Optional: Whether this rule should always be applied (default: false)
version: "2.1.0" # Required: Semantic versioning
lastUpdated: "2025-05-19" # Required: Date of last update (YYYY-MM-DD)
compatibleWith: ["List-Compatible-Rules"] # Optional: References to compatible rules
---
```

#### Metadata Field Specifications

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|-----------------|
| description | String | Yes | Short description of the rule | Max 500 chars |
| globs | Array<String> | No | File patterns this rule applies to | Valid glob patterns |
| alwaysApply | Boolean | No | Whether rule always applies | true/false (default: false) |
| version | String | Yes | Version of the rule | Must follow Semantic Versioning (e.g., "2.1.0") |
| lastUpdated | String | Yes | Last update date | YYYY-MM-DD format |
| compatibleWith | Array<String> | No | Compatible rules | Must reference valid rule files |

### Directive Sections

Directive sections are markdown sections that begin with a level-2 heading (`##`). Each section represents a specific directive category for the AI.

#### Standard Directive Sections

| Section Number | Section Name | Purpose | Example |
|----------------|--------------|---------|---------|
| 1 | Role & Responsibility | Defines the AI assistant's role and primary responsibilities | `## 1. Role & Responsibility` |
| 2 | Core Principles | Specifies fundamental principles and guidelines | `## 2. Core Principles` |
| 3 | Process & Methodology | Outlines the step-by-step process to follow | `## 3. Process & Methodology` |
| 4 | Best Practices | Provides best practices for the specific context | `## 4. Best Practices` |
| 5 | Common Patterns & Examples | Shows code examples and patterns to follow | `## 5. Common Patterns & Examples` |
| 6 | Common Pitfalls & Mistakes | Describes issues to avoid | `## 6. Common Pitfalls & Mistakes` |
| 7 | Response Format | Specifies how responses should be formatted | `## 7. Response Format` |
| 8 | Return Protocol | Defines how to return after completing tasks | `## 8. Return Protocol` |

#### Directive Section Structure

Each directive section should follow this format:

```markdown
## Section Name

Free-form markdown content that describes the directive.

- Can include bullet points
- Tables
- Formatted text

### Optional subsections (Level-3 headings)

More specific content related to the section.
```

### Code Blocks

Code examples should be enclosed in fenced code blocks with appropriate language identifiers:

````markdown
```javascript
// Example JavaScript code
function exampleFunction() {
  return true;
}
```
````

### Special Directives

Special directives use a specific syntax for machine-readable instructions:

```markdown
!directive[parameter]{value}
```

For example:

```markdown
!priority[implementation_style]{high}
!ignore[file_pattern]{node_modules/**}
!reference[rule]{01-project-context.mdc}
```

## Rule Categories and File Organization

.mdc files should be organized in a structured directory hierarchy:

```
.ai/
  rules/
    00-core-agent.mdc           # Core agent behavior (priority: 100)
    01-project-context.mdc      # Project-wide context (priority: 90)
    02-common-errors.mdc        # Common error patterns (priority: 80)
    03-mcp-configuration.mdc    # MCP configuration (priority: 70)
    languages/                  # Language-specific rules (priority: 60-69)
      TypeScript-Modern.mdc
      Python3.mdc
    technologies/               # Framework/library rules (priority: 50-59)
      NextJS.mdc
      Django.mdc
    patterns/                   # Architectural pattern rules (priority: 40-49)
      MVC.mdc
      MVVM.mdc
    custom/                     # User-defined custom rules (priority: 0-39)
      project-specific.mdc
```

## Rule Precedence and Conflict Resolution

Rules are applied according to the following precedence logic:

1. Rules are first sorted by priority value (higher values take precedence)
2. Within the same priority level:
   - More specific rules (e.g., framework-specific) override more general rules
   - Later rules in alphabetical order override earlier rules when there's a direct conflict
3. Rules with explicit dependencies are guaranteed to be applied after their dependencies
4. Specialized sections take precedence over general sections

## Validation Rules

### Valid .mdc File Checklist

- Contains a properly formatted YAML metadata header
- Has at least one directive section (level-2 heading)
- All directive sections contain content
- Code examples use proper fenced code block syntax
- Special directives follow the prescribed format
- No conflicting directives within the same file

### Common Validation Errors

| Error | Description | Resolution |
|-------|-------------|------------|
| Invalid Metadata | Metadata header is missing or malformed | Ensure YAML is valid and includes all required fields |
| Missing Directive | File contains no directive sections | Add at least one level-2 heading with content |
| Invalid Special Directive | Special directive has incorrect syntax | Use proper `!directive[param]{value}` format |
| Empty Section | A section contains no content | Add content or remove the section |
| Directive Conflict | File contains conflicting directives | Review and resolve contradictory guidance |

## Extending the Schema

The .mdc schema can be extended in the following ways:

1. **New Directive Sections**: Add new level-2 headings for specialized guidance
2. **Custom Special Directives**: Define new special directives using the `!name[param]{value}` syntax
3. **Additional Metadata Fields**: Add custom fields to the metadata header for specialized information

When extending the schema, follow these guidelines:
- Document all extensions clearly
- Maintain backward compatibility where possible
- Validate that AI tools can correctly interpret the extensions

## Example .mdc File

```markdown
---
name: "TypeScript Best Practices"
description: "Defines best practices for TypeScript development in this project"
version: "1.0.0"
author: "John Doe"
date: "2025-05-16"
priority: 65
tags: ["typescript", "best-practices", "coding-standards"]
platforms: ["cursor", "vscode", "github-copilot", "claude", "windsurf", "jetbrains", "zed"]
dependencies: ["01-project-context.mdc"]
---

## Implementation Preferences

### TypeScript Standards

- Use interfaces for object types rather than type aliases
- Enable strict mode in TypeScript configuration
- Use explicit return types for functions
- Prefer readonly properties when values should not be changed
- Use proper TypeScript utility types (Pick, Omit, Readonly, etc.)

### Naming Conventions

- Interfaces should be PascalCase and should not be prefixed with 'I'
- Enums should be PascalCase
- Type aliases should be PascalCase
- Functions should be camelCase
- Variables should be camelCase
- Constants should be UPPER_SNAKE_CASE for primitive values, camelCase for objects and arrays

## Code Examples

### Interface Example

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  readonly createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
}

// Prefer this utility type transformation
type PartialUser = Partial<User>;

// Instead of redefining all properties
```

### Function Example

```typescript
async function fetchUserById(id: number): Promise<User | null> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data as User;
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    return null;
  }
}
```
```

## Conclusion

This schema documentation provides a standardized structure for creating and validating .mdc files in the VibeKit VDK CLI framework. Following this schema ensures consistency and compatibility across different AI tools and platforms while maintaining the flexibility to express a wide range of guidance and instructions.
