# 📖 Vibe Coding Rules - Complete Installation & Usage Guide

> **Transform your development workflow with intelligent AI assistance**

This comprehensive guide covers everything you need to know about installing, configuring, and using Vibe Coding Rules to enhance your AI-assisted development experience.

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Installation Methods](#-installation-methods)
3. [Setup Wizard](#-setup-wizard)
4. [Configuration](#-configuration)
5. [Usage Patterns](#-usage-patterns)
6. [Advanced Features](#-advanced-features)
7. [Troubleshooting](#-troubleshooting)
8. [Best Practices](#-best-practices)

## 🔧 Prerequisites

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (or pnpm 10.12.1+)
- **Git**: For repository management and rule synchronization
- **Operating System**: macOS, Linux, or Windows

### Supported Development Environments
- VS Code / VS Code Insiders
- Cursor AI
- Windsurf / Windsurf Next
- GitHub Copilot
- Claude (Desktop & Code)
- JetBrains IDEs (IntelliJ, WebStorm, PyCharm, etc.)
- Zed Editor

## 🚀 Installation Methods

### Method 1: Interactive Setup Wizard (Recommended)

The setup wizard provides the easiest and most comprehensive installation experience:

```bash
# 1. Clone the repository
git clone https://github.com/idominikosgr/Vibe-Coding-Rules.git
cd Vibe-Coding-Rules

# 2. Install dependencies
npm install
# or with pnpm
pnpm install

# 3. Run the interactive setup wizard
npm run wizard
```

### Method 2: Direct Project Scanning

For advanced users who want immediate scanning without configuration:

```bash
# Install dependencies
npm install

# Basic project scan
npm run scan

# Advanced scanning with options
npm run scan -- --path /path/to/your/project \
                --output ./.ai/rules \
                --deep \
                --verbose \
                --use-gitignore
```

### Method 3: Global Installation (Coming Soon)

```bash
# Future global installation
npm install -g vibe-coding-rules
vibe-rules init my-project
```

### Method 4: Manual Integration

For minimal setups or integration into existing projects:

```bash
# 1. Clone into your project's .ai directory
git clone https://github.com/idominikosgr/Vibe-Coding-Rules.git .ai

# 2. Install dependencies
cd .ai && npm install

# 3. Generate initial rules
npm run scan -- --path ../ --output ./rules
```

## 🧙‍♂️ Setup Wizard

The interactive setup wizard guides you through four different configuration modes:

### Mode Selection

When you run `npm run wizard`, you'll be presented with setup options:

```
🎯 Welcome to Vibe Coding Rules Setup

Choose your setup mode:
❯ ☁️  Remote Sync     - Download latest community rules
  🔍 Automatic       - Scan and configure automatically  
  🔧 Manual          - Choose technologies manually
  🔄 Hybrid          - Auto-scan + manual adjustments
```

### 1. ☁️ Remote Sync Mode

Downloads and configures the latest rules from the community repository:

```bash
✓ Connecting to community repository...
✓ Downloading latest rule templates...
✓ Configuring for your IDE: VS Code
✓ Setup complete! Rules synced from community.
```

**Best for:**
- Getting started quickly with proven rules
- Teams wanting standardized configurations
- Projects using common technology stacks

### 2. 🔍 Automatic Mode (Recommended)

Automatically scans your project and generates customized rules:

```bash
🔍 Scanning project structure...
✓ Detected: TypeScript (primary language)
✓ Detected: React (frontend framework)  
✓ Detected: Next.js (meta-framework)
✓ Detected: Tailwind CSS (styling)
✓ Detected: Prisma (database ORM)

📝 Generating customized rules...
✓ Core agent rules generated
✓ Project context rules generated  
✓ Common errors rules generated
✓ Technology-specific rules generated

Continue with detected configuration? (Y/n)
```

**Best for:**
- Most projects and teams
- Quick setup with intelligent detection
- Projects with standard technology stacks

### 3. 🔧 Manual Mode

Provides full control over technology selection:

```bash
🛠️ IDE/Tool Selection:
❯ VS Code
  Cursor AI  
  Windsurf
  GitHub Copilot
  Claude Desktop
  JetBrains IDEs

📚 Framework Selection:
❯ React
  Next.js
  Vue.js
  Angular
  Express.js
  Django

💻 Language Selection:
❯ TypeScript
  JavaScript
  Python
  Java
```

**Best for:**
- Complex or unique project setups
- Custom technology combinations
- Teams with specific requirements

### 4. 🔄 Hybrid Mode

Combines automatic detection with manual refinement:

```bash
🔍 Auto-detected technologies:
✓ TypeScript, React, Next.js, Tailwind CSS

🔧 Manual adjustments:
❯ Add additional technologies
  Remove detected technologies
  Modify rule templates
  Configure advanced options
```

**Best for:**
- Projects with mixed technology stacks
- Teams wanting to review auto-detection
- Custom rule template requirements

## ⚙️ Configuration

### Project Path Configuration

The wizard will detect or prompt for your project path:

```
🔍 Project Path Detection
Current directory: /Users/username/my-project
✓ Valid Node.js project detected
✓ Package.json found
✓ Git repository detected

Use current directory? (Y/n)
```

### IDE-Specific Configuration

Each IDE has specific integration requirements:

#### VS Code Integration
```bash
# Automatic configuration
✓ Created .vscode/ai-rules/ directory
✓ Updated settings.json for AI integration
✓ Configured MCP server settings

# Manual verification
ls .vscode/ai-rules/
# Should contain generated .mdc files
```

#### Cursor AI Integration
```bash
# Automatic configuration  
✓ Created .cursor/rules/ directory
✓ Enhanced Claude integration configured
✓ Project-aware chat responses enabled

# Manual verification
ls .cursor/rules/
# Should contain project-specific rules
```

#### JetBrains Integration
```bash
# Automatic configuration
✓ Created .idea/ai-rules/ directory
✓ AI Assistant plugin compatibility configured
✓ IntelliJ-based IDE support enabled

# Manual verification
ls .idea/ai-rules/
# Should contain rule files and config.xml
```

### MCP Server Configuration

Model Context Protocol integration for enhanced AI capabilities:

```bash
# Automatic MCP setup
./update-mcp-config.sh

# Manual MCP configuration
npm run scan -- --ide-integration
```

**MCP Configuration Example:**
```json
{
  "servers": {
    "memory-server": {
      "command": "node",
      "args": ["memory-server.js"],
      "description": "Persistent context management",
      "capabilities": ["memory", "context", "history"]
    },
    "code-analysis": {
      "command": "python", 
      "args": ["analysis-server.py"],
      "description": "Advanced code analysis"
    }
  }
}
```

## 🎯 Usage Patterns

### Daily Development Workflow

1. **Start Development Session**
   ```bash
   # AI automatically loads project context
   # No additional setup required
   ```

2. **Get Context-Aware Suggestions**
   ```
   👤 "Create a new user authentication component"
   🤖 "Based on your Next.js + TypeScript setup, I'll create:
       • Component following your src/components structure
       • Using your custom useAuth hook pattern
       • TypeScript interfaces from types/User.ts
       • Styled with your Tailwind CSS utility classes"
   ```

3. **Leverage Project Patterns**
   ```
   👤 "Add error handling to this API call"
   🤖 "I'll add error handling using your established pattern:
       • Custom ErrorBoundary wrapper
       • Error logging with your logging service
       • User notification via your toast system"
   ```

### Advanced Usage Scenarios

#### Custom Rule Templates
```bash
# Create custom template directory
mkdir -p templates/custom

# Generate with custom templates
npm run scan -- --templates "project-context,custom-template,performance-rules"
```

#### Rule Synchronization
```bash
# Initialize sync with remote repository
npm run sync-init

# Check sync status
npm run sync-status

# Sync with latest community rules
npm run sync

# Force sync (overwrite local changes)
npm run sync-force
```

#### Performance Optimization
```bash
# Large codebase optimization
npm run scan -- --ignorePattern "**/node_modules/**" "**/dist/**"

# Use gitignore patterns
npm run scan -- --use-gitignore

# Skip deep analysis for speed
npm run scan  # (without --deep flag)
```

## 🔬 Advanced Features

### Project Analysis Options

#### Comprehensive Scanning
```bash
# Deep analysis with full context
npm run scan -- --deep --verbose

# Scan specific directory
npm run scan -- --path ./src --output ./custom-rules

# Watch for changes and regenerate
npm run scan -- --watch
```

#### Technology-Specific Analysis
```bash
# Generate rules for specific frameworks
npm run scan -- --templates "typescript-modern,react-patterns,nextjs-enterprise"

# Skip validation for faster generation
npm run scan -- --skip-validation

# Enable strict validation mode
npm run scan -- --strict
```

### Rule Management

#### Validation and Quality Control
```bash
# Validate all rules
npm run validate-rules

# Check for duplicate rules
npm run check-duplicate-rules

# Preview specific rule
npm run preview-rule -- project-context
```

#### Rule Customization

Generated rules use `.mdc` format (Markdown with YAML frontmatter):

```yaml
---
description: "Project-specific React patterns and conventions"
globs: "**/*.tsx,**/*.jsx,**/*.ts"
alwaysApply: false
platforms: ["vscode", "cursor", "github-copilot"]
lastUpdated: "2025-01-20"
tags: ["react", "typescript", "nextjs"]
---

# {{projectName}} React Guidelines

## Component Structure
Your project uses functional components with hooks...

## Naming Conventions
- Components: PascalCase (e.g., UserProfile)
- Hooks: camelCase starting with 'use' (e.g., useAuth)
- Files: kebab-case for utilities, PascalCase for components
```

### Memory and Context Management

#### Session Continuity
```bash
# AI remembers previous sessions
"Remember that we decided to use Redux for state management"

# Reference past conversations  
"Apply the same pattern we used for the user authentication module"
```

#### Enhanced Analysis
```bash
# Deep code understanding
"Analyze the entire codebase and suggest improvements"

# Cross-file pattern detection
"Find all components that follow the same pattern as UserProfile"
```

### Team Collaboration

#### Shared Rule Configuration
```bash
# Commit rules to version control
git add .ai/rules/
git commit -m "Add project-specific AI rules"
git push origin main
```

#### Onboarding New Developers
```bash
# New team member setup
git clone project-repo
cd project-repo
npm install
npm run wizard  # AI immediately understands project
```

## 🔧 Troubleshooting

### Common Installation Issues

#### Node.js Version Problems
```bash
# Check Node.js version
node --version

# Update Node.js using nvm
nvm install 18
nvm use 18

# Or update npm
npm install -g npm@latest
```

#### Permission Issues
```bash
# Fix npm permissions on macOS/Linux
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Windows: Run terminal as administrator
```

#### Dependency Installation Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps
```

### Rule Generation Issues

#### Rules Not Generating
```bash
# Enable verbose logging for debugging
npm run scan -- --verbose

# Check for specific errors
npm run validate-rules

# Verify project structure
ls package.json  # Should exist for Node.js projects
ls requirements.txt  # Should exist for Python projects
```

#### AI Not Using Project Context
```bash
# Verify rule placement
ls .vscode/ai-rules/     # VS Code
ls .cursor/rules/        # Cursor
ls .idea/ai-rules/       # JetBrains

# Restart IDE/AI assistant
# Reload AI assistant configuration
```

#### Performance Issues
```bash
# Use ignore patterns for large projects
npm run scan -- --ignorePattern "**/node_modules/**" "**/dist/**" "**/.git/**"

# Enable gitignore parsing
npm run scan -- --use-gitignore

# Monitor memory usage
npm run scan -- --verbose
```

### IDE Integration Problems

#### VS Code Issues
```bash
# Check VS Code settings
cat .vscode/settings.json

# Verify AI extension installation
# Reload VS Code window (Cmd+R / Ctrl+R)
```

#### Cursor AI Issues
```bash
# Verify Cursor configuration
ls .cursor/rules/

# Check Claude API integration
# Restart Cursor application
```

#### MCP Server Issues
```bash
# Update MCP configuration
./update-mcp-config.sh

# Check MCP server status
# Review MCP logs in IDE
```

### Debugging Options

```bash
# Enable all debugging features
npm run scan -- --verbose \
                --strict \
                --ide-integration \
                --deep

# Check component status
npm run validate-rules
npm run check-duplicate-rules

# Test with minimal configuration
npm run scan -- --skip-validation --path ./
```

## 🎯 Best Practices

### Rule Organization

1. **Keep Rules Specific**: Target specific technologies and patterns
2. **Update Regularly**: Sync with community improvements
3. **Document Customizations**: Comment your custom rules clearly
4. **Version Control**: Always commit rules with your project

### AI Interaction Optimization

1. **Reference Rules Explicitly**: "Follow the project's naming conventions"
2. **Use Project Context**: "Apply the same pattern as in the auth module"
3. **Validate AI Suggestions**: Check output against project rules
4. **Iterate and Improve**: Update rules based on experience

### Team Workflow Integration

1. **Establish Rule Standards**: Team agreement on rule customizations
2. **Regular Rule Updates**: Schedule community rule sync updates
3. **Documentation Maintenance**: Keep team knowledge current
4. **Training**: Ensure team knows how to use AI features effectively

### Performance Optimization

1. **Use Ignore Patterns**: Exclude unnecessary files from analysis
2. **Selective Scanning**: Use specific paths for targeted analysis
3. **Incremental Updates**: Regenerate rules only when needed
4. **Monitor Resource Usage**: Watch memory and CPU during large scans

## 🔄 Keeping Up to Date

### Automatic Updates
```bash
# Set up automatic sync service
npm run install-sync-service

# Check auto-sync status
npm run auto-sync-status

# Run sync daemon
npm run auto-sync-daemon
```

### Manual Updates
```bash
# Check for updates
git pull origin main
npm install

# Update rules
npm run sync

# Regenerate project rules
npm run scan
```

### Community Engagement
- **GitHub Discussions**: Share experiences and get help
- **Issue Reporting**: Report bugs and request features
- **Contributing**: Submit improvements and new templates

## 📚 Next Steps

After successful installation and setup:

1. **Test AI Integration**: Notice enhanced context-aware responses
2. **Customize Rules**: Edit generated `.mdc` files for your needs
3. **Explore Advanced Features**: MCP servers, custom templates, CI/CD
4. **Join the Community**: Share your experience and learn from others

## 🆘 Getting Help

- **Documentation**: Check the `docs/` directory for detailed guides
- **GitHub Issues**: [Report problems](https://github.com/idominikosgr/Vibe-Coding-Rules/issues)
- **Discussions**: [Community support](https://github.com/idominikosgr/Vibe-Coding-Rules/discussions)
- **Email**: [Contact maintainer](mailto:idominikosgr@example.com)

---

*Installation and usage guide based on comprehensive project analysis - Updated January 2025*