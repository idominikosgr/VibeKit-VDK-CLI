# Publishing Guide for Vibe Coding Rules

This project is structured as a **single comprehensive npm package** that includes both rule templates and project analysis capabilities.

## Package Structure

```
vibe-coding-rules/
├── .ai/                           # Core rule templates
├── templates/                     # Rule templates for setup
├── tools/
│   ├── project-scanner/           # Project analysis engine
│   ├── validation/                # Rule validation tools
│   └── sync/                      # Rule synchronization
├── src/                           # Source code
│   ├── shared/                    # Shared utilities
│   ├── scanner/                   # Project scanner
│   ├── validation/                # Rule validation
│   ├── sync/                      # Remote sync system
│   ├── preview/                   # Rule preview tools
│   └── utils/                     # Utility tools
├── cli.js                        # Main CLI entry point
└── package.json
```

## What Users Get

When users install `vibe-coding-rules`, they get:

- **🧙‍♂️ Interactive Setup Wizard** (`vibe-rules` or `vibe-setup`)
- **🔍 Project Scanner** (`vibe-scan`) - Analyzes codebases automatically
- **✅ Rule Validator** (`validate-rules`) - Ensures rule quality
- **🔄 Rule Sync** (`sync-rules`) - Keeps rules updated
- **📚 Comprehensive Rule Templates** - For all major frameworks/languages

## Publishing Steps

### 1. Pre-Publishing Checklist

```bash
# Install dependencies
npm install

# Run validation
npm run validate

# Run tests
npm test

# Check linting
npm run lint

# Test the CLI commands
npm run setup --help
npm run scan --help
```

### 2. Version Management

Update version in `package.json`:
```json
{
  "version": "1.0.0"  // Semantic versioning
}
```

### 3. Publishing Commands

```bash
# Dry run to see what will be published
npm publish --dry-run

# Publish to npm
npm publish

# Or publish with specific tag
npm publish --tag beta
```

## Installation & Usage

### For End Users

```bash
# Global installation (recommended)
npm install -g vibe-coding-rules

# Use the setup wizard
vibe-rules

# Or scan a project directly
vibe-scan --path ./my-project
```

### For Developers

```bash
# Local installation
npm install vibe-coding-rules

# Use via npx
npx vibe-rules
npx vibe-scan
```

## CLI Commands Available After Installation

| Command | Description | Example |
|---------|-------------|---------|
| `vibe-rules` | Interactive setup wizard | `vibe-rules` |
| `vibe-setup` | Alias for setup wizard | `vibe-setup` |
| `vibe-scan` | Direct project scanning | `vibe-scan --path ./src` |
| `validate-rules` | Validate rule files | `validate-rules` |
| `sync-rules` | Sync with remote rules | `sync-rules sync` |

## Package Distribution Strategy

### Single Package Benefits
- ✅ **Simplified Installation** - One command gets everything
- ✅ **Integrated Workflow** - Scanner and templates work together seamlessly
- ✅ **Consistent Versioning** - All components stay in sync
- ✅ **Easier Maintenance** - Single release cycle
- ✅ **Better User Experience** - No confusion about which package to install

### Target Audiences
1. **Individual Developers** - Want quick setup for personal projects
2. **Development Teams** - Need consistent rules across team members
3. **Enterprise Users** - Require comprehensive analysis and customization

## Release Process

1. **Development** → Test locally with `npm link`
2. **Testing** → Run full test suite and validation
3. **Documentation** → Update README and guides
4. **Versioning** → Follow semantic versioning
5. **Publishing** → Publish to npm registry
6. **Announcement** → Update repository and notify users

## Post-Publishing

After publishing, users can immediately:

```bash
# Install globally
npm install -g vibe-coding-rules

# Run setup wizard
vibe-rules

# The wizard will:
# 1. Detect their IDE/editor
# 2. Analyze their project (if they choose)
# 3. Generate custom rules
# 4. Configure their AI assistant
```

This approach provides a **complete solution in one package** while maintaining the flexibility and power of the integrated scanner and template system. 