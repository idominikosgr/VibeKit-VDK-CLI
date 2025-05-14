# CodePilotRules Documentation Overview

This project implements an enhanced rules system for AI-assisted development, storing a structured set of prompting rules in the `.ai/rules/` directory. These rules enhance the capabilities and consistency of various AI assistants working within codebases across different platforms and IDEs.

## Purpose

CodePilotRules provides context, guidelines, and specific instructions to various AI assistants, helping them understand:

- Project-specific configurations (tech stack, file structure, conventions) via `01-project-context.mdc`
- Common errors or anti-patterns to avoid via `02-common-errors.mdc`
- How to perform 51 specialized tasks (debugging, refactoring, session handoff, etc.) using defined rules in the **Tasks** directory
- Best practices for specific **Languages** or **Technologies** used in the project
- Assistant-specific configurations via the **Assistants** directory
- AI tool enhancements via the **AI-Tools** directory
- Available **MCP** (Model Context Protocol) servers and their usage via `03-mcp-configuration.mdc`
- Memory management and session continuity protocols

By using CodePilotRules, developers can achieve more accurate, relevant, and efficient AI assistance tailored to their specific project needs across multiple AI platforms and IDEs.

## Project Rules Structure (`.ai/rules/`)

The `.ai/rules/` directory contains:

- **Core Rules (`00-*`, `01-*`, `02-*`, etc.):** Foundational rules defining the AI's core behavior, project context, and common errors
- **Tasks (`tasks/`)**: 51 rules defining specific behaviors or workflows for particular development activities (e.g., `AI-Session-Handoff.mdc`, `Code-Quality-Review.mdc`)
- **Assistants (`assistants/`)**: Rules specific to various AI assistants (e.g., `Windsurf.mdc`)
- **Languages (`languages/`):** Rules defining best practices for specific programming languages (e.g., `Swift.mdc`, `TypeScript.mdc`)
- **Technologies (`technologies/`):** Rules defining best practices for specific frameworks, libraries, or platforms (e.g., `SwiftUI.mdc`, `GraphQL.mdc`)
- **AI Tools (`ai-tools/`)**: Guides for AI-enhanced development (e.g., `Agentic-AI-Development.mdc`, `Sequential-Thinking-Advanced.mdc`)

## Rule File Format (`.mdc` Files)

Each rule file uses Markdown (`.mdc` extension) with a required YAML frontmatter header block.

### Header (YAML Frontmatter)

The header block must start and end with `---` and define the following keys:

- `description`: (String, Quoted) A brief, clear description of the rule's purpose and when it should be applied. This helps the AI determine semantic relevance.
- `globs`: (String, Quoted) A comma-separated list of file glob patterns. If the user's active file context matches any of these patterns, the rule is more likely to be automatically applied. Use standard glob syntax (e.g., `"**/*.py,*.js,*config*"`). Do not use brace expansion (`{}`). Leave empty (`""`) or omit if the rule should only be activated semantically or explicitly.
- `alwaysApply`: (Boolean, `true` or `false`) If `true`, the rule will always be considered by the AI, regardless of context. This should be used sparingly, primarily for essential core rules like `00-core-agent.mdc`. Most rules should use `false`.

**Example Header:**
```yaml
---
description: "Python 3 best practices and common patterns."
globs: "**/*.py,**/pyproject.toml,**/requirements.txt"
alwaysApply: false
---
```

### Body (Markdown Content)

The body of the file uses standard Markdown to provide instructions to the AI.

- **Structure:** Use headings (`#`, `##`, `###`), lists (`-`, `*`, `1.`), code blocks (```), and other Markdown elements for clarity and organization.
- **Content:** Include clear instructions, guidelines, do's and don'ts, code examples, patterns to follow or avoid, and potentially references to other rules or external documentation.
- **Referencing Other Files:** You can include the content of other files (including other rules) as context within a rule by using the `@` symbol followed by the relative path (e.g., `@../01-project-context.mdc`, `@./PythonBaseClass.py`). The AI will have access to the content of the referenced file when the rule is active.

## Activation

Project Rules can be activated:

- **Automatically (Glob Match):** Based on the active file context matching patterns listed in a rule's `globs`.
- **Semantically (Description Match):** The AI may choose to apply a rule based on its `description` matching the user's request or the context.
- **Explicitly:** By user request (e.g., "Refactor this code") or by `@`-mentioning the rule file in the chat (e.g., `@tasks/Refactor-Code.mdc`).

## Creating New Rules

There are several ways to create new project rules in CodePilotRules:

1. **Interactive Setup Wizard:** Use the provided setup wizard to create properly structured rule files
2. **AI Assistance:** Use the dedicated task rule by asking the AI: `@tasks/Create-Cursor-Rule.mdc` 
3. **Manual Creation:** Follow the established format to create new .mdc files in the appropriate directories

## Best Practices for Writing Rules

- **Be Specific:** Provide concrete examples and actionable instructions rather than general principles
- **Keep Concise:** Focus rules on a specific topic or task. Avoid overly long or complex rules
- **Use Clear Structure:** Employ Markdown headings and lists to organize information logically
- **Consider Context:** Write rules with the assumption that the AI might have limited context
- **Include Version Information:** Add version, lastUpdated, and compatibleWith fields to all rule files
- **Leverage `globs`:** Use `globs` effectively to ensure rules are automatically considered when relevant files are open
- **Refine `description`:** Write clear, concise descriptions to aid semantic activation
- **Test and Iterate:** Review how the AI uses your rules and refine them based on its behavior
- **Maintain Consistency:** Follow the established structure and formatting conventions

## Cross-Platform Usage

CodePilotRules is designed to work across multiple AI coding assistant platforms:

- **IDE-Specific Integration:** The setup wizard configures the appropriate directory structure for your chosen IDE or AI tool
- **AI Assistant Rules:** Different AI assistants may use different rule loading mechanisms, which the CodePilotRules setup process handles automatically
- **Memory Management:** The `AI-Session-Handoff.mdc` task helps maintain continuity across development sessions regardless of the AI platform being used

## Specialized Components

- **Memory Management System:** Guidelines for capturing project context, decisions, and milestones
- **AI Session Handoff:** Procedures for maintaining continuity across development sessions
- **Version Control:** Tracking system for rule updates and dependencies between rule files

---
*See `README.md` for installation and update instructions for the CodePilotRules project and `CHANGELOG.md` for detailed version history.*
