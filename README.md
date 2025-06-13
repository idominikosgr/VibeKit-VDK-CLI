<div align="center">

# 🚀 Vibe Coding Rules

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/idominikosgr/CodePilotRules?style=social)](https://github.com/idominikosgr/CodePilotRules)
[![Last Updated](https://img.shields.io/badge/Last%20Updated-May%202025-brightgreen)](https://github.com/idominikosgr/CodePilotRules)

**An enhanced framework for AI-assisted development that provides comprehensive rules, patterns, and guidelines for AI coding assistants across multiple platforms, languages, and technologies.**

</div>

## 📋 Overview

Vibe Coding Rules enhances AI-assisted development by providing comprehensive guidelines for AI coding assistants across multiple platforms. The project features specialized rules for various languages, frameworks, and technologies, with a focus on modern development practices, memory management, and cross-session continuity.


### ✨ Key Features

- 🌐 Multi-platform support for different AI assistants and IDEs

- 🧩 Enhanced language and technology-specific rule files

- 💾 Memory management and session handoff protocols

- 🔧 Interactive setup wizard for project-specific configuration

- 🏷️ Version-controlled rule files with compatibility indicators


## 🏗️ Structure

The rules are organized in `.ai/rules/` with a comprehensive and extensible structure:


- **🛠️ Core rules**: Foundation files that define AI behavior and project context (`00-*`, `01-*`, `02-*`, etc.)

- **📝 Tasks (`tasks/`)**: 51 task-specific rules for specialized AI behaviors (e.g., `AI-Session-Handoff.mdc`, `Code-Quality-Review.mdc`)

- **🤖 Assistants (`assistants/`)**: Rules specific to various AI assistants (e.g., `Windsurf.mdc`)

- **💻 Language Support**

Comprehensive guidelines for modern programming languages:

- **🍎 Swift**: Swift 5.9/6.0 API design, structured concurrency, macros, result builders
  - **📱 SwiftUI**: Modern SwiftUI patterns with NavigationStack

- **🌐 Advanced Framework Templates**
  - **⚛️ React**: Modern React with hooks, context, suspense
  - **🅰️ Angular**: Angular with RxJS, OnPush change detection
  - **🔵 Vue.js**: Vue 3 with Composition API and Pinia
  - **🟢 Node.js/Express**: Modern server architecture patterns
  - **🐍 Django**: Django with best practices and DRF, observable architecture
  - **💾 SwiftData**: Core Data replacement with SwiftUI integration
  - **🔄 Combine**: Reactive programming patterns

- **📘 TypeScript**: Modern TypeScript with functional programming patterns
  - **⚛️ React**: Component design, hooks architecture, state management
  - **🧩 Vue**: Composition API, type-safe templates
  - **🅰️ Angular**: Modular architecture, dependency injection

- **🐍 Python**: Modern Python with type annotations, async/await patterns
  - **🖼️ PySide/PyQt**: Modern UI development patterns
  - **⚡ FastAPI**: API development with type validation
  - **🧪 Pytest**: Comprehensive testing patterns

- **⚙️ Technology rules (`technologies/`)**: Framework and tool-specific guidelines
  - **📱 SwiftUI.mdc**: Modern SwiftUI with NavigationStack and performance patterns

  - **🖼️ PySideUI.mdc**: Python UI development with modern integration approaches

  - **🔄 GraphQL.mdc**: Schema design and implementation best practices

  - **🐳 Docker-Kubernetes.mdc**: Container design and orchestration patterns

  - **⚡ Tauri.mdc**: Modern Electron alternative usage patterns

  - **💾 SwiftData.mdc**: Apple's data persistence framework guidelines

- **🧠 AI Tools (`ai-tools/`)**: Guides for AI-enhanced development
  - **🤖 Agentic-AI-Development.mdc**: Guidelines for different AI assistants
  - **🔌 MCP-Server-Integration.mdc**: Guidelines for server-assisted workflows
  - **🧩 Sequential-Thinking-Advanced.mdc**: Problem-solving strategies
  - **⚙️ AI-Workflow-Integration.mdc**: Task-specific AI usage patterns

- **🛠️ Tool Guides (`tools/`)**: Guidelines for common development tools
  - **📁 File-Operations.mdc**: Best practices for file manipulation
  - **🔍 Code-Search.mdc**: Effective code search patterns
  - **⌨️ Command-Execution.mdc**: Safe terminal command execution

```
.ai/rules/
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

### 📊 Analytics & Feedback

Vibe Coding Rules includes a robust analytics and feedback system that helps track rule usage and collect user input:

- **Usage Analytics**: Track which rules are most frequently used, downloaded, and copied
- **Search Insights**: Understand what developers are looking for and how they find rules
- **User Feedback**: Collect structured feedback on rules for continuous improvement
- **Performance Metrics**: Measure the impact of rules on development workflows

### 🔗 Editor Path Integration

The Editor Path Integration system automatically configures paths across different development environments:

- **Auto-Detection**: Automatically detects and configures editor-specific paths
- **Multi-Environment Support**: Works across VS Code, Cursor, Claude, Windsurf, JetBrains, and more
- **MCP Configuration**: Automatically updates the MCP configuration file with correct paths
- **Path Resolution**: Resolves absolute and relative paths based on your environment
- **Simple Updates**: Run `./update-mcp-config.sh` to refresh editor configuration

## Installation

### Option 1: Interactive Setup (Recommended)

1. Clone this repository:

```bash
git clone https://github.com/idominikosgr/CodePilotRules.git
cd CodePilotRules
```

2. Install dependencies:

```bash
npm install
```

3. Run the setup wizard:

```bash
npm run wizard
```

4. Choose your setup mode:
   - **☁️ Remote** - Download latest rules from [AI.rules repository](https://github.com/idominikosgr/AI.rules)
   - **🔍 Automatic** - Scan your project and generate custom rules
   - **🔧 Manual** - Select technologies and frameworks individually
   - **🔄 Hybrid** - Combine automatic scanning with manual adjustments

5. Follow the interactive prompts to configure Vibe Coding Rules for your project:
   - Enter your project path
   - Select your IDE or AI coding tool (VS Code, Cursor AI, Windsurf, GitHub Copilot, Claude, JetBrains IDEs, Zed Editor, etc.)
   - Choose your primary framework
   - Select your programming language
   - Pick your technology stack
   - Select additional technologies
   - Choose AI tools to configure

The wizard will automatically create the appropriate directory structure and copy the relevant rule files to your project.

### Remote Rule Synchronization

Keep your rules up-to-date with the latest improvements from the community:

```bash
# Sync with remote repository
npm run sync

# Check sync status
npm run sync-status

# Enable automatic sync
npm run sync-init

# Set up auto-sync service
npm run install-sync-service
```

For detailed sync system documentation, see [docs/SYNC-SYSTEM.md](docs/SYNC-SYSTEM.md).

### Option 2: Manual Installation

1. Clone this repository into your project:

```bash
git clone https://github.com/idominikosgr/CodePilotRules.git .ai
```

2. Customize the project-specific files:

- Edit `.ai/rules/01-project-context.mdc` with your project details
- Modify `.ai/rules/02-common-errors.mdc` with project-specific anti-patterns
- Update `.ai/rules/03-mcp-configuration.mdc` with your MCP server configuration

## Usage

### For AI Assistant Users

Vibe Coding Rules will be automatically loaded when you use supported AI coding assistants in a project containing these rules.

#### Supported AI Tools and IDEs

- **VS Code / VS Code Insiders**: Use with AI extensions
- **Cursor AI**: Automatically integrates with project rules
- **GitHub Copilot**: Enhanced with context from rules
- **Claude (Desktop & Code)**: Optimized integration
- **Windsurf / Windsurf Next (formerly Codeium)**: Configured for seamless use
- **JetBrains IDEs**: Compatible with AI assistant plugins
- **Zed Editor**: Works with AI features

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

1. Open your AI tool's settings:
   - **VS Code**: Open Settings (Cmd+, or Ctrl+,) → MCP section
   - **VS Code Insiders**: Open Settings → MCP section
   - **Cursor**: Open Settings (Cmd+, or Ctrl+,) → MCP section
   - **Windsurf**: Configure through settings UI
   - **Claude Desktop**: Check MCP configuration
   - **JetBrains IDEs**: Settings → Tools → AI Assistant → Model Context Protocol (MCP)
   - **Zed Editor**: Configure through settings
2. Locate your MCP configuration file:
   - VS Code: `.vscode/mcp.json` (project) or `~/Library/Application Support/Code/User/settings.json` (global)
   - VS Code Insiders: `.vscode-insiders/mcp.json` or `~/Library/Application Support/Code - Insiders/User/settings.json`
   - Cursor: `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global)
   - Windsurf: `~/.codeium/windsurf/mcp_config.json`
   - Claude Desktop: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Claude Code: `.claude/settings.json` (project) or `~/.claude/settings.json` (global)
   - JetBrains: Configure through IDE settings
3. Make sure the configuration file is active in your editor
4. **Automatic Method**: Run the provided script to automatically detect and configure MCP paths
   ```bash
   ./update-mcp-config.sh
   ```
   This will scan your environment for editor configurations and populate the MCP settings accordingly.
5. **Manual Method**: Attach the configuration file to your AI assistant chat (or open it in an editor window)
   - In the AI chat, ask: "Please populate `.ai/rules/03-mcp-configuration.mdc` based on the attached `mcp.json` context."
   - The AI should read the attached `mcp.json` context and fill in the details about each server in `03-mcp-configuration.mdc`.

## Benefits

- More accurate code assistance based on your project context
- Stack-specific guidance for different technology combinations
- Consistent response format and quality
- Reduced need to repeat instructions
- Improved code quality and adherence to best practices

## Customization

The rule files use a consistent Markdown format that's easy to customize for your specific needs. See the `Vibe-Coding-Rules-StandardizationPlan.md` file for detailed formatting guidelines and best practices.

## Updating

To update the standard `tasks/`, `languages/`, `technologies/` rules and the core `00-core-agent.mdc`, while preserving your customized `01-project-context.mdc` and `02-common-errors.mdc`:

```bash
curl -fsSL https://raw.githubusercontent.com/idominikosgr/CodePilotRules/main/install.sh | sh -s -- --upgrade
```
*Note: The upgrade process preserves `03-mcp-configuration.mdc`. If new standard MCP servers are added to Vibe Coding Rules in the future, you may need to manually update your `03-mcp-configuration.mdc` or ask the AI to regenerate it.*

## Contributing

Contributions to Vibe Coding Rules are welcome and appreciated! You can help improve this project in various ways:

1. **Fork and clone** the repository
2. **Create a feature branch** for your changes (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the existing style and format
4. **Test extensively** before submitting:
   - Verify the rules work with compatible AI tools (e.g., VS Code, Cursor, GitHub Copilot, Claude, Windsurf, etc.)
   - Test across different IDEs when possible to ensure broad compatibility
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
  - **🍎 Swift Language Rules**: Updated for Swift 5.9/6.0 with macros, concurrency best practices
  - **📱 SwiftUI Technology Rules**: Added NavigationStack patterns, performance optimization techniques
  - **💻 TypeScript Language Rules**: Modern TypeScript with functional programming patterns
  - **🐍 Python Language Rules**: Modern Python with type annotations, async/await patterns
  - **🖼️ PySideUI Technology Rules**: Added modern Python integration, asyncio patterns

- **New Technology Files**
  - **🔄 GraphQL**: Schema design, client/server implementation guidance
  - **🐳 Docker/Kubernetes**: Container design, security, deployment strategies
  - **⚡ Tauri**: Modern Electron alternative with security and performance best practices
  - **💾 SwiftData**: Apple's data persistence framework with SwiftUI integration patterns

## 🌟 Features

### 🧠 AI Tools Enhancement

- **🤖 Agentic AI Development**: Comprehensive guide for different AI assistants and models

- **🔌 MCP Server Integration**: Patterns for effective memory usage and server integration

- **🧩 Sequential Thinking Advanced**: In-depth guide for breaking down complex problems

- **⚙️ AI Workflow Integration**: Task-specific patterns for AI-assisted development


### 🔄 Memory and Handoff Systems

- Added memory management guidelines for capturing project context

- Implemented AI session handoff procedures for maintaining continuity


### 🔼 Enhanced

- **Core rule integration**
  - Updated `00-core-agent.mdc` with all 51 task references

  - Added version indicators to core rule files for tracking updates

  - Enhanced compatibility indicators across rule files


### 🔄 Changed

- Project renamed from DevRules to Vibe Coding Rules

- Reorganized directory structure from `.cursor/rules/` to `.ai/rules/`

- Updated README with new features and organizational structure

- Added IDE/tool-specific configuration options for multiple AI ecosystems


## 📚 Origin & Attribution

Vibe Coding Rules is an enhanced version of the original [DevRules](https://github.com/TheSethRose/DevRules) project created by Seth Rose. While substantially expanded with new features including multi-IDE support, memory management, and 51 task rule files, this project builds upon the original DevRules foundation and maintains the same MIT license terms.


<div align="center">

**[📦 Official Repository](https://github.com/idominikosgr/CodePilotRules)**

</div>

We gratefully acknowledge Seth Rose's original work which provided the conceptual framework for this project.


## 👏 Acknowledgments

- Contributors to the enhanced memory management and session handoff systems

- The wider AI assistant developer community for inspiration and testing


## 📚 Documentation

Comprehensive documentation is available to help you get started and make the most of Vibe Coding Rules:

- **[📖 Getting Started Guide](docs/getting-started.md)**: Quick start for new users
- **[📋 Project Scanner Guide](tools/project-scanner/USER-GUIDE.md)**: Detailed guide for using the Project Scanner
- **[🛠️ Template Reference](docs/templates.md)**: Details on all available templates and customization options
- **[🔌 IDE Integration Guide](docs/ide-integration.md)**: Setting up Vibe Coding Rules with your favorite IDE

## 🔧 Tools

- **🧙‍♂️ Setup Wizard**: Interactive configuration for new projects
- **🔍 Project Scanner**: Analyzes project structure to generate custom rules
  - **✅ Rule Validation**: Validates generated rules for correctness and consistency
  - **🔌 IDE Integration**: Seamless integration with popular IDEs
  - **🏛️ Architecture Recognition**: Detects MVC, MVVM, and Microservices patterns
  - **📊 Project Analysis**: Intelligent project complexity assessment

## 🔮 Future Plans & Roadmap

We have an extensive roadmap of planned enhancements and features to further improve AI-assisted development. These include actionable ideas and strategic initiatives to help both human developers and AI coding assistants achieve optimal results.

Check out our detailed roadmap here: [**ROADMAP.md**](ROADMAP.md)

---

<div align="center">

© Original DevRules: Seth Rose - [GitHub](https://github.com/TheSethRose)
© Vibe Coding Rules Enhancements: Dominikos Pritis - [GitHub](https://github.com/idominikosgr)
© 2025 Vibe Coding Rules

</div>