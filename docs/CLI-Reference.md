# 🖥️ CLI Reference Guide

Complete command-line interface reference for VibeKit VDK CLI.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Global Options](#global-options)
3. [Core Commands](#core-commands)
4. [Setup Commands](#setup-commands)
5. [Scanning Commands](#scanning-commands)
6. [Rule Management](#rule-management)
7. [Sync Commands](#sync-commands)
8. [Validation Commands](#validation-commands)
9. [Utility Commands](#utility-commands)
10. [Advanced Usage](#advanced-usage)

## Overview

The VibeKit VDK CLI CLI provides comprehensive tooling for project analysis, rule generation, and management. All commands can be run with `npm run <command>` or directly with `node cli.js <command>`.

## Global Options

Available for all commands:

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--help` | `-h` | Show command help | - |
| `--version` | `-v` | Show version information | - |
| `--verbose` | `-V` | Enable verbose output | `false` |
| `--quiet` | `-q` | Suppress non-error output | `false` |
| `--debug` | - | Enable debug logging | `false` |
| `--no-color` | - | Disable colored output | `false` |

## Core Commands

### `wizard`

Interactive project setup wizard.

```bash
npm run wizard
node cli.js wizard
```

**Options:**
- `--mode <mode>` - Setup mode: `auto`, `manual`, `remote`, `hybrid`
- `--skip-prompts` - Use default values for all prompts
- `--config-file <path>` - Use custom configuration file

**Examples:**
```bash
# Run wizard with automatic mode
npm run wizard -- --mode auto

# Skip all prompts (use defaults)
npm run wizard -- --skip-prompts

# Use custom configuration
npm run wizard -- --config-file ./my-config.json
```

### `scan`

Analyze project and generate rules without interactive prompts.

```bash
npm run scan
node cli.js scan
```

**Options:**
- `--path <path>` - Project path to scan (default: current directory)
- `--output <path>` - Output directory for rules (default: `.ai/rules`)
- `--deep` - Enable deep analysis mode
- `--shallow` - Use shallow analysis (faster)
- `--exclude <patterns>` - Exclude patterns (glob format)
- `--include <patterns>` - Include patterns (glob format)
- `--timeout <ms>` - Scanner timeout in milliseconds
- `--batch-size <n>` - Process files in batches of n

**Examples:**
```bash
# Scan current directory
npm run scan

# Scan specific path with deep analysis
npm run scan -- --path /path/to/project --deep

# Scan with exclusions
npm run scan -- --exclude "node_modules,build,dist"

# Scan with timeout
npm run scan -- --timeout 30000
```

## Setup Commands

### `init`

Initialize VibeKit VDK CLI in an existing project.

```bash
node cli.js init [project-path]
```

**Options:**
- `--force` - Overwrite existing configuration
- `--template <name>` - Use specific template

**Examples:**
```bash
# Initialize in current directory
node cli.js init

# Initialize in specific directory
node cli.js init /path/to/project

# Force overwrite existing setup
node cli.js init --force
```

### `setup`

Legacy setup command (alias for wizard).

```bash
npm run setup
```

## Scanning Commands

### `scan-project`

Detailed project analysis with reporting.

```bash
node cli.js scan-project [options]
```

**Options:**
- `--report` - Generate analysis report
- `--format <type>` - Report format: `json`, `markdown`, `text`
- `--save-report <path>` - Save report to file

**Examples:**
```bash
# Scan with markdown report
node cli.js scan-project --report --format markdown

# Save report to file
node cli.js scan-project --report --save-report analysis.md
```

### `analyze`

Analyze specific aspects of your project.

```bash
node cli.js analyze <type> [options]
```

**Types:**
- `dependencies` - Analyze project dependencies
- `patterns` - Detect code patterns
- `architecture` - Analyze project architecture
- `technologies` - Detect technologies and frameworks
- `quality` - Code quality analysis

**Examples:**
```bash
# Analyze dependencies
node cli.js analyze dependencies

# Analyze code patterns with verbose output
node cli.js analyze patterns --verbose

# Analyze project architecture
node cli.js analyze architecture --output architecture.json
```

## Rule Management

### `generate`

Generate specific rule types.

```bash
node cli.js generate <rule-type> [options]
```

**Rule Types:**
- `core` - Core agent rules
- `project` - Project context rules
- `language` - Language-specific rules
- `technology` - Technology-specific rules
- `task` - Task-specific rules

**Options:**
- `--template <name>` - Use specific template
- `--output <path>` - Output file path
- `--force` - Overwrite existing files

**Examples:**
```bash
# Generate core rules
node cli.js generate core

# Generate TypeScript language rules
node cli.js generate language --template typescript

# Generate with custom output
node cli.js generate project --output custom-context.mdc
```

### `list`

List available rules, templates, or configurations.

```bash
node cli.js list <type>
```

**Types:**
- `rules` - List generated rules
- `templates` - List available templates
- `tasks` - List task rules
- `languages` - List language rules
- `technologies` - List technology rules

**Examples:**
```bash
# List all generated rules
node cli.js list rules

# List available templates
node cli.js list templates

# List task rules with details
node cli.js list tasks --verbose
```

## Sync Commands

### `sync`

Synchronize with remote rule repository.

```bash
npm run sync
node cli.js sync [options]
```

**Options:**
- `--force` - Force sync, overwriting local changes
- `--remote <url>` - Use specific remote repository
- `--branch <name>` - Use specific branch
- `--conflict-resolution <mode>` - Conflict resolution: `prompt`, `remote`, `local`, `backup`

**Examples:**
```bash
# Basic sync
npm run sync

# Force sync (overwrite local changes)
npm run sync-force
# or
node cli.js sync --force

# Sync from specific branch
node cli.js sync --branch develop
```

### `sync-status`

Check synchronization status.

```bash
npm run sync-status
node cli.js sync-status
```

### `sync-init`

Initialize sync configuration.

```bash
npm run sync-init
node cli.js sync-init
```

## Validation Commands

### `validate`

Validate rule files and configuration.

```bash
npm run validate
node cli.js validate [options]
```

**Options:**
- `--path <path>` - Validate specific path
- `--rules-only` - Validate only rule files
- `--strict` - Enable strict validation
- `--fix` - Attempt to fix validation errors

**Examples:**
```bash
# Validate all rules
npm run validate

# Validate specific directory
node cli.js validate --path .ai/rules/tasks

# Strict validation with auto-fix
node cli.js validate --strict --fix
```

### `check-duplicates`

Check for duplicate or conflicting rules.

```bash
npm run check-duplicates
node cli.js check-duplicates
```

**Options:**
- `--fix` - Attempt to resolve conflicts
- `--report` - Generate conflict report

### `lint`

Lint rule files for style and format issues.

```bash
node cli.js lint [options]
```

**Options:**
- `--fix` - Automatically fix lint issues
- `--format <type>` - Output format: `table`, `json`, `compact`

## Utility Commands

### `clean`

Clean up generated files and caches.

```bash
node cli.js clean [options]
```

**Options:**
- `--rules` - Clean generated rules
- `--cache` - Clean analysis cache
- `--temp` - Clean temporary files
- `--all` - Clean everything

**Examples:**
```bash
# Clean all caches
node cli.js clean --cache

# Clean everything
node cli.js clean --all
```

### `config`

Manage configuration settings.

```bash
node cli.js config <action> [key] [value]
```

**Actions:**
- `get <key>` - Get configuration value
- `set <key> <value>` - Set configuration value
- `list` - List all configuration
- `reset` - Reset configuration to defaults

**Examples:**
```bash
# Get current config
node cli.js config list

# Set scan timeout
node cli.js config set scan.timeout 30000

# Reset to defaults
node cli.js config reset
```

### `info`

Display system and project information.

```bash
node cli.js info
```

Displays:
- System information
- Node.js version
- Project details
- Configuration status
- IDE integration status

## Advanced Usage

### Chaining Commands

```bash
# Scan and validate in one go
npm run scan && npm run validate

# Clean, scan, and sync
node cli.js clean --cache && node cli.js scan && node cli.js sync
```

### Using with CI/CD

```bash
# Non-interactive scan for CI
node cli.js scan --quiet --no-color

# Validate in CI pipeline
node cli.js validate --strict --no-color && echo "Validation passed"
```

### Custom Templates

```bash
# List available templates
node cli.js list templates

# Generate with custom template
node cli.js generate core --template my-custom-template

# Validate template
node cli.js validate --path templates/my-template.mdc
```

### Environment Variables

Set environment variables to customize behavior:

```bash
# Set debug mode
export DEBUG=vibe-coding-rules*

# Set custom config path
export VIBE_CONFIG_PATH=/path/to/config.json

# Disable colors
export NO_COLOR=1

# Set default output directory
export VIBE_OUTPUT_DIR=.my-rules
```

### Batch Operations

```bash
# Scan multiple projects
for dir in project1 project2 project3; do
  node cli.js scan --path "$dir" --output "$dir/.ai/rules"
done

# Validate all project rules
find . -name "*.mdc" -exec node cli.js validate --path {} \;
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments |
| 3 | File system error |
| 4 | Network error |
| 5 | Validation error |
| 6 | Configuration error |

## Examples & Use Cases

### Development Workflow

```bash
# Initial setup
npm run wizard

# Regular development
npm run scan              # After major changes
npm run validate          # Before commits
npm run sync              # Weekly updates

# Troubleshooting
npm run validate --fix    # Fix issues
node cli.js info          # Check status
```

### Team Setup

```bash
# Team lead setup
npm run wizard -- --mode remote
npm run sync

# Team member setup
git clone <project>
npm install
npm run sync
```

### CI/CD Integration

```bash
# .github/workflows/rules.yml
- name: Validate rules
  run: |
    npm install
    node cli.js validate --strict --no-color
    node cli.js check-duplicates
```

---

**Need help with a specific command?** Use `--help` with any command for detailed information:
```bash
node cli.js scan --help
npm run wizard -- --help
```