# DevRulesPlus

An enhanced framework for AI-assisted development that provides comprehensive rules, patterns, and guidelines for AI coding assistants across multiple platforms, languages, and technologies.

## Overview

DevRulesPlus enhances AI-assisted development by providing comprehensive guidelines for AI coding assistants across multiple platforms. The project features specialized rules for various languages, frameworks, and technologies, with a focus on modern development practices, memory management, and cross-session continuity.

Key features include:
- Multi-platform support for different AI assistants and IDEs
- Enhanced language and technology-specific rule files
- Memory management and session handoff protocols
- Interactive setup wizard for project-specific configuration
- Version-controlled rule files with compatibility indicators

## Structure

The rules are organized in `.ai/rules/` with a comprehensive and extensible structure:

- **Core rules**: Foundation files that define AI behavior and project context (`00-*`, `01-*`, `02-*`, etc.)
- **Tasks (`tasks/`)**: 51 task-specific rules for specialized AI behaviors (e.g., `AI-Session-Handoff.mdc`, `Code-Quality-Review.mdc`)
- **Assistants (`assistants/`)**: Rules specific to various AI assistants (e.g., `Windsurf.mdc`)
- **Language rules (`languages/`)**: Best practices for programming languages
  - **Swift.mdc**: Updated for Swift 5.9/6.0 with macros and concurrency patterns
  - **TypeScript.mdc**: Modern TypeScript with functional programming patterns
  - **Python.mdc**: Python best practices and typing patterns
- **Technology rules (`technologies/`)**: Framework and tool-specific guidelines
  - **SwiftUI.mdc**: Modern SwiftUI with NavigationStack and performance patterns
  - **PySideUI.mdc**: Python UI development with modern integration approaches
  - **GraphQL.mdc**: Schema design and implementation best practices
  - **Docker-Kubernetes.mdc**: Container design and orchestration patterns
  - **Tauri.mdc**: Modern Electron alternative usage patterns
  - **SwiftData.mdc**: Apple's data persistence framework guidelines
- **AI Tools (`ai-tools/`)**: Guides for AI-enhanced development
  - **Agentic-AI-Development.mdc**: Guidelines for different AI assistants
  - **MCP-Server-Integration.mdc**: Patterns for memory server integration
  - **Sequential-Thinking-Advanced.mdc**: Complex problem decomposition
  - **AI-Workflow-Integration.mdc**: Task-specific AI-assisted patterns
- **Tool Guides (`tools/`)**: Guidelines for common development tools
  - **File-Operations.mdc**: Best practices for file manipulation
  - **Code-Search.mdc**: Effective code search patterns
  - **Command-Execution.mdc**: Safe terminal command execution

```
.cursor/rules/
├── 00-core-agent.mdc       # Core AI instructions
├── 01-project-context.mdc  # Project-specific details (customize!)
├── 02-common-errors.mdc    # Common mistakes to avoid (customize!)
├── 03-mcp-configuration.mdc # MCP server configuration and usage
├── languages/
│   └── TypeScript-Modern.mdc  # Modern TypeScript best practices
├── stacks/                 # NEW! Complete technology stack guides
│   ├── Supabase-NextJS-Stack.mdc
│   ├── NextJS-Enterprise-Stack.mdc
│   ├── TRPC-FullStack.mdc
│   ├── Astro-Content-Stack.mdc
│   ├── Ecommerce-Stack.mdc
│   └── ReactNative-Mobile-Stack.mdc
├── technologies/          # Framework/library specific guides
│   ├── MCP-Servers.mdc    # Model Context Protocol guides
│   ├── Sequential-Thinking.mdc
│   ├── Memory-MCP.mdc
│   └── ShadcnUI-Integration.mdc
└── tools/                 # Development tools guides
    ├── File-Operations.mdc
    ├── Code-Search.mdc
    └── Command-Execution.mdc
```

## Key Features

- **Technology Stack Guides**: Complete guides for modern full-stack development combinations
- **Modern TypeScript Patterns**: Best practices for functional programming, type safety and maintainable code
- **MCP Server Integration**: Optimized patterns for working with Model Context Protocol servers
- **Enhanced AI Code Generation**: Specific guidelines to improve AI-generated code quality
- **Tool-Specific Rules**: Best practices for file operations, code search and command execution
- **Cross-Framework Consistency**: Maintain consistent patterns across different frameworks and libraries
- **Consistent AI assistance** across your entire development workflow
- **Task-specific guidance** for different development activities
- **Project-specific context** for more relevant suggestions
- **Error prevention** through common mistake documentation
- **Reduced repetition** of instructions to AI tools

## Installation

### Option 1: Interactive Setup (Recommended)

1. Clone this repository:

```bash
git clone https://github.com/idominikosgr/DevRulesPlus.git
cd DevRulesPlus
```

2. Run the setup wizard:

```bash
node setup-wizard.js
```

3. Follow the interactive prompts to configure DevRulesPlus for your project:
   - Enter your project path
   - Select your IDE or AI coding tool (Cursor AI, Windsurf, GitHub Copilot, VS Code, etc.)
   - Choose your primary framework
   - Select your programming language
   - Pick your technology stack
   - Select additional technologies
   - Choose AI tools to configure

The wizard will automatically create the appropriate directory structure and copy the relevant rule files to your project.

### Option 2: Manual Installation

1. Clone this repository into your project:

```bash
git clone https://github.com/idominikosgr/DevRulesPlus.git .cursor
```

2. Customize the project-specific files:

- Edit `.cursor/rules/01-project-context.mdc` with your project details
- Modify `.cursor/rules/02-common-errors.mdc` with project-specific anti-patterns
- Update `.cursor/rules/03-mcp-configuration.mdc` with your MCP server configuration

## Usage

### For Cursor AI Users

DevRulesPlus will be automatically loaded when you use Cursor AI in a project containing these rules.

### For GitHub Copilot Users

While Copilot doesn't directly support loading external rules, you can still benefit by:

1. Keeping the rules visible in your workspace
2. Referencing specific rule files in your prompts

### For ChatGPT/Claude Users

Upload relevant rule files to provide context when working on specific tasks.

### Activating a Task Rule

You can explicitly request a specific task rule:

```
Please refactor this code using @tasks/Refactor-Code.mdc
```

Or the AI might activate a task rule semantically based on your request.

### Providing Project Context

For new projects, you should update the project context file:

```
Please update the project context with our React/Node.js stack and component structure.
```

### Documenting Common Errors

Add project-specific patterns to avoid:

```
Please add a common error pattern about our naming convention for API routes.
```

### Configuring MCP Awareness

To ensure the AI knows which MCP servers are available and how they are configured:

1. Open Cursor Settings (Cmd+, or Ctrl+,)
2. Go to the 'MCP' section
3. Open your global `~/.cursor/mcp.json` file via the provided button/link
4. Make sure `mcp.json` is the active file in your editor
5. In the AI chat, ask: "Please populate `.cursor/rules/03-mcp-configuration.mdc` based on the attached `mcp.json` context."
6. The AI should read the attached `mcp.json` context and fill in the details about each server in `03-mcp-configuration.mdc`.

## Benefits

- More accurate code assistance based on your project context
- Stack-specific guidance for different technology combinations
- Consistent response format and quality
- Reduced need to repeat instructions
- Improved code quality and adherence to best practices

## Customization

The rule files use a consistent Markdown format that's easy to customize for your specific needs. See the `Cursor-Rules.md` file at the project root for detailed formatting guidelines and best practices.

## Updating

To update the standard `tasks/`, `languages/`, `technologies/` rules and the core `00-core-agent.mdc`, while preserving your customized `01-project-context.mdc` and `02-common-errors.mdc`:

```bash
curl -fsSL https://raw.githubusercontent.com/idominikosgr/DevRulesPlus/main/install.sh | sh -s -- --upgrade
```
*Note: The upgrade process preserves `03-mcp-configuration.mdc`. If new standard MCP servers are added to DevRules in the future, you may need to manually update your `03-mcp-configuration.mdc` or ask the AI to regenerate it.*

## Contributing

Contributions to DevRulesPlus are welcome and appreciated! You can help improve this project in various ways:

1. **Fork and clone** the repository
2. **Create a feature branch** for your changes (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the existing style and format
4. **Test extensively** before submitting:
   - Verify the rules work with compatible AI tools (e.g., Cursor)
   - Test different scenarios and edge cases
   - Document your testing process
5. **Submit a pull request** with:
   - Clear description of changes (`git commit -m 'Add some amazing feature'`)
   - Evidence of testing (screenshots, examples, etc.)
   - Any relevant documentation updates
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please ensure any new modes or significant changes have been thoroughly tested in real-world development scenarios. Include examples of AI responses that demonstrate your changes are working as expected.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### [2.0.0] - 2025-05-14

#### Added

- **Comprehensive Task System**
  - Consolidated 51 specialized task files in `.ai/rules/tasks/`
  - Added new task types including `AI-Session-Handoff.mdc` for continuity between development sessions
  - Created `Accessibility-Review.mdc` for UI/UX accessibility compliance checks
  - Added data analysis tasks (`Analyze-Data.mdc`, `Analyze-Logs.mdc`, `Analyze-Dependencies.mdc`)
  - Implemented API-specific tasks (`API-Docs.mdc`, `API-Endpoints.mdc`)

- **Enhanced Language and Technology Rule Files**
  - **Swift Language Rules**: Updated for Swift 5.9/6.0 with macros, concurrency best practices
  - **SwiftUI Technology Rules**: Added NavigationStack patterns, performance optimization techniques
  - **PySideUI Technology Rules**: Added modern Python integration, asyncio patterns
 
- **New Technology Files**
  - **GraphQL**: Schema design, client/server implementation guidance
  - **Docker/Kubernetes**: Container design, security, deployment strategies
  - **Tauri**: Modern Electron alternative with security and performance best practices
  - **SwiftData**: Apple's data persistence framework with SwiftUI integration patterns

- **AI Tools Enhancement**
  - **Agentic AI Development**: Comprehensive guide for different AI assistants and models
  - **MCP Server Integration**: Patterns for effective memory usage and server integration
  - **Sequential Thinking Advanced**: In-depth guide for breaking down complex problems
  - **AI Workflow Integration**: Task-specific patterns for AI-assisted development

- **Memory and Handoff Systems**
  - Added memory management guidelines for capturing project context
  - Implemented AI session handoff procedures for maintaining continuity

#### Enhanced

- **Core rule integration**
  - Updated `00-core-agent.mdc` with all 51 task references
  - Added version indicators to core rule files for tracking updates
  - Enhanced compatibility indicators across rule files

#### Changed

- Project renamed from DevRules to DevRulesPlus
- Reorganized directory structure from `.cursor/rules/` to `.ai/rules/`
- Updated README with new features and organizational structure
- Added IDE/tool-specific configuration options for multiple AI ecosystems

## Origin & Attribution

DevRulesPlus is an enhanced version of the original [DevRules](https://github.com/TheSethRose/DevRules) project created by Seth Rose. While substantially expanded with new features including multi-IDE support, memory management, and 51 task rule files, this project builds upon the original DevRules foundation and maintains the same MIT license terms.

**Official Repository:** [https://github.com/idominikosgr/DevRulesPlus](https://github.com/idominikosgr/DevRulesPlus)

We gratefully acknowledge Seth Rose's original work which provided the conceptual framework for this project.

## Acknowledgments

- Contributors to the enhanced memory management and session handoff systems
- The wider AI assistant developer community for inspiration and testing

---

© Original DevRules: Seth Rose - [GitHub](https://github.com/TheSethRose)  
© DevRulesPlus Enhancements: Dominikos Pritis - [GitHub](https://github.com/idominikosgr)  
© 2025 DevRulesPlus