# Editor Path Integration Guide

This document provides information about the Editor Path Integration system in Vibe Coding Rules.

## Overview

The Editor Path Integration system automatically detects and configures paths to editor configurations and MCP servers across different development environments. This helps ensure that AI assistants have accurate path information when working with your project, regardless of which editor or environment you're using.

### Workflow Diagram

The following diagram illustrates the flow of the editor path integration system:

![Editor Path Integration Flow](editor-path-flow.md)

*Note: View this file in an editor that supports Mermaid diagrams to see the flowchart.*

## Core Components

The system consists of several key components:

### 1. Editor Path Resolver (`src/shared/editor-path-resolver.js`)

This module provides functions for:
- Resolving global and project-specific editor configuration paths
- Accessing MCP server configurations
- Expanding platform-specific paths (like ~ on Unix systems)
- Generating MCP configuration content based on detected editor environments

### 2. Update MCP Configuration Tool (`tools/update-mcp-config.js`)

A command-line tool that:
- Detects IDE configurations in your project
- Finds rule directories
- Updates the MCP configuration file with editor-specific paths
- Creates or updates the `03-mcp-configuration.mdc` file

### 3. Setup Wizard Integration

The setup wizard has been enhanced to:
- Automatically update MCP configuration during setup
- Detect editor configurations in your environment
- Configure appropriate directory structures

### 4. Helper Script (`update-mcp-config.sh`)

A convenient shell script for:
- Running the MCP configuration update tool
- Providing options for customization (path, force update, verbosity)

## Usage

### Basic Usage

To update your MCP configuration with the latest editor paths:

```bash
./update-mcp-config.sh
```

### Advanced Options

```bash
./update-mcp-config.sh --path=/path/to/project --force
```

Options:
- `--path=DIR`: Path to the project root (default: current directory)
- `--force`: Update configuration even if no editors are detected
- `--quiet`: Reduce output verbosity
- `--help`: Show help message

## Editor Paths

The system supports these editors and their configuration paths:

### VS Code / VS Code Insiders

| Item | Path |
|------|------|
| Global settings | `~/Library/Application Support/Code/User/settings.json` |
| Project settings | `.vscode/settings.json` |
| MCP configuration | `.vscode/mcp.json` |

### Cursor

| Item | Path |
|------|------|
| Global settings | `~/Library/Application Support/Cursor/User/settings.json` |
| MCP configuration | `.cursor/mcp.json` or `~/.cursor/mcp.json` |

### Windsurf (formerly Codeium)

| Item | Path |
|------|------|
| MCP configuration | `~/.codeium/windsurf/mcp_config.json` or `~/.codeium/windsurf-next/mcp_config.json` |

### Claude Desktop/Code

| Item | Path |
|------|------|
| Global settings | `~/.claude/settings.json` |
| Project settings | `.claude/settings.json` |
| MCP configuration | `~/Library/Application Support/Claude/claude_desktop_config.json` |

### JetBrains IDEs

| Item | Path |
|------|------|
| Configuration | `~/Library/Preferences/IntelliJIdeaXX` |
| MCP configuration | Settings > Tools > AI Assistant > Model Context Protocol |

## Technical Details

### Path Resolution Process

1. Detect editors present in the project directory
2. For each detected editor, locate MCP configuration files
3. Determine active configuration (project-specific or global)
4. Parse configuration files to extract MCP server information
5. Generate formatted content for the MCP configuration file
6. Update the `03-mcp-configuration.mdc` file with editor paths and server information

### MCP Server Discovery

The system attempts to detect MCP servers from various sources:
- Project-specific configuration files
- Global configuration files
- IDE-specific settings

When servers are found, their information is included in the generated configuration.

## Troubleshooting

### No Editors Detected

If no editors are detected in your project:
- Use the `--force` option to create a default configuration
- Manually specify the project path with `--path=DIR`