# Changelog

All notable changes to the Vibe Coding Rules project will be documented in this file.

## [2.1.0] - 2025-05-20

### Added

- **Enhanced Multi-IDE Support**
  - Comprehensive expansion of supported IDE and AI tool integrations
  - Added dedicated assistant rule files for all major AI tools and IDEs
  - Updated configuration instructions for all supported environments
  - Created platform-specific documentation and integration guides
  - Renamed Create-Cursor-Rule.mdc to Create-AI-Rule.mdc for inclusivity

- **Automated Editor Path Integration**
  - Added editor path resolver system to standardize configuration paths
  - Created `update-mcp-config.sh` script for automatic MCP configuration
  - Enhanced setup wizard to integrate with editor path resolver
  - Improved MCP configuration templating with editor-specific paths
  - Added comprehensive documentation in Editor Path Integration Guide

### Changed

- Updated all platform references to include full range of supported tools
- Improved MCP configuration documentation with IDE-specific paths
- Enhanced core agent rules to reference all assistant-specific behaviors
- Updated documentation with platform-specific setup instructions

## [2.0.0] - 2025-05-14

### Added

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
  - Created standardized memory format with title, tags, and structured content
  - Developed hierarchical approach with different memory types

- **Interactive Setup Wizard**
  - Built setup wizard with IDE/tool selection
  - Added support for multiple AI tooling ecosystems
  - Implemented appropriate directory structure creation based on selected tool

### Enhanced

- **Core Rule Integration**
  - Updated `00-core-agent.mdc` with all 51 task references
  - Added version indicators to core rule files for tracking updates
  - Enhanced compatibility indicators across rule files
  - Added version, lastUpdated, and compatibleWith fields to rule files

### Changed

- Project renamed from DevRules to Vibe Coding Rules
- Reorganized directory structure from `.cursor/rules/` to `.ai/rules/`
- Updated README with new features and organizational structure
- Added IDE/tool-specific configuration options for multiple AI ecosystems
- Added comprehensive support for additional AI tools and IDEs:
  - VS Code / VS Code Insiders
  - Claude Desktop and Claude Code
  - Windsurf / Windsurf-next (formerly Codeium)
  - JetBrains IDEs (IntelliJ, PyCharm, WebStorm, etc.)
  - Zed Editor

### Technical Notes

- The setup wizard creates appropriate directory structure based on selected IDE/tool
- Memory management follows hierarchical approach with different memory types
- Version indicators help track rule updates and dependencies between rule files
- Node.js implementation for setup wizard provides broad compatibility

### Next Steps

- Complete version indicator updates for all rule files
- Implement testing for setup wizard across different environments
- Create additional technology rule files for emerging frameworks
- Develop unified API for rule file integration with different AI systems
- Add support for CI/CD integration in Vibe Coding Rules
