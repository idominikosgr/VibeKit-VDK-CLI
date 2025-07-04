# 🚀 Getting Started with VibeKit VDK CLI

> **Get your AI assistant project-aware in under 5 minutes**

This guide will get you up and running with VibeKit VDK CLI quickly, transforming your AI coding assistant from a generic helper to a project-aware expert.

## ⚡ Quick Start (5 Minutes)

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.0.0+ ([Download here](https://nodejs.org/))
- **Git** for version control
- One of the supported IDEs/editors:
  - VS Code / VS Code Insiders
  - Cursor AI
  - Windsurf
  - GitHub Copilot
  - Claude Desktop
  - JetBrains IDEs
  - Zed Editor

### Installation & Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/idominikosgr/vibekit-vdk-cli.git
   cd vibekit-vdk-cli
   npm install
   ```

2. **Run Interactive Setup**
   ```bash
   npm run wizard
   ```

3. **Choose Your Setup Mode**
   ```
   🎯 Choose your setup mode:
   ❯ ☁️  Remote Sync     - Download latest community rules
     🔍 Automatic       - Scan and configure automatically  
     🔧 Manual          - Choose technologies manually
     🔄 Hybrid          - Auto-scan + manual adjustments
   ```

4. **Done!** Your AI assistant now understands your project.

## 🎯 What You Get

After setup, your AI assistant will understand:

- **Project Architecture** - Your file structure and organization patterns
- **Technology Stack** - Frameworks, libraries, and tools you use
- **Coding Conventions** - Your naming patterns and code style
- **Common Patterns** - Project-specific implementations and best practices
- **Error Prevention** - Common mistakes to avoid in your codebase

## 🔍 Verify It's Working

Test your setup by asking your AI assistant:

```
"Create a new user component following our project patterns"
```

**Before VibeKit VDK CLI:**
```
🤖 "Here's a basic React component..."
```

**After VibeKit VDK CLI:**
```
🤖 "Based on your project patterns, I'll create a component using:
    • TypeScript with your interface patterns
    • Your styled-components architecture  
    • Custom hooks following your useAuth pattern
    • Error boundaries as per your standards"
```

## 📁 What Was Created

The setup created a `.ai/rules/` directory with:

```
.ai/rules/
├── 00-core-agent.mdc           # AI behavior guidelines
├── 01-project-context.mdc      # Project-specific patterns
├── 02-common-errors.mdc        # Anti-patterns to avoid
├── 03-mcp-configuration.mdc    # MCP server settings
├── tasks/                      # Task-specific workflows
├── languages/                  # Language-specific rules
└── technologies/               # Framework-specific rules
```

## 🛠️ Quick Commands

```bash
# Re-scan your project (after major changes)
npm run scan

# Sync with community rules
npm run sync

# Validate your rules
npm run validate

# Check for conflicts
npm run check-duplicates
```

## 🎭 Setup Modes Explained

### ☁️ Remote Sync
- Downloads latest community-curated rules
- Best for: Standard tech stacks, getting started quickly
- Time: ~30 seconds

### 🔍 Automatic (Recommended)
- Scans your project automatically
- Detects technologies and patterns
- Best for: Most projects
- Time: ~2 minutes

### 🔧 Manual
- Full control over technology selection
- Custom configurations
- Best for: Complex or unique setups
- Time: ~5 minutes

### 🔄 Hybrid
- Auto-scan + manual adjustments
- Best of both worlds
- Best for: Projects with custom patterns
- Time: ~3 minutes

## ❓ Troubleshooting

### "No rules were generated"
- Ensure your project has recognizable code files
- Try manual mode to specify technologies
- Check the [Troubleshooting Guide](Troubleshooting-Guide.md)

### "AI assistant not following rules"
- Restart your IDE/editor
- Verify rule files exist in `.ai/rules/`
- Check IDE-specific integration in [Editor Path Integration Guide](Editor-Path-Integration-Guide.md)

### "Rules seem generic"
- Run `npm run scan` to regenerate with current code
- Customize `01-project-context.mdc` manually
- See [Rule Authoring Guide](Rule-Authoring-Guide.md) for customization

## 📚 Next Steps

1. **Customize Rules** - Edit `01-project-context.mdc` with project specifics
2. **Add Team Patterns** - Document team-specific conventions
3. **Explore Tasks** - Try task-specific rules like `@tasks/Code-Quality-Review.mdc`
4. **Share with Team** - Use sync system for team consistency

## 🔗 Learn More

- **[Complete Installation Guide](../GUIDE.md)** - Detailed setup options
- **[Rule Authoring Guide](Rule-Authoring-Guide.md)** - Create custom rules
- **[Task System Guide](Task-System-Guide.md)** - 51+ specialized workflows
- **[Memory Management Guide](Memory-Management-Guide.md)** - Session continuity

---

**Need help?** Check our [Troubleshooting Guide](Troubleshooting-Guide.md) or open an issue on GitHub.