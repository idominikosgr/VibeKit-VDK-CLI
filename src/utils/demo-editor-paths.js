#!/usr/bin/env node

/**
 * Editor Path Integration Demo Script
 * -----------------------
 * This script demonstrates how the editor path integration system works
 * by creating mock editor configurations and showing how they're detected.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import * as editorPathResolver from '../shared/editor-path-resolver.js';
import * as ideConfig from '../shared/ide-configuration.js';

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m'
};

console.log(`${colors.bright}${colors.blue}Editor Path Integration Demo${colors.reset}\n`);
console.log(`This script demonstrates how the editor path integration system detects`);
console.log(`and configures different editor environments.\n`);

// Create a temporary directory for the demo
const tempDir = path.join(os.tmpdir(), `vibecoding-demo-${Date.now()}`);
fs.mkdirSync(tempDir, { recursive: true });
console.log(`${colors.cyan}Created demo directory: ${tempDir}${colors.reset}\n`);

// Create mock editor configurations
console.log(`${colors.bright}Creating mock editor configurations...${colors.reset}`);

// 1. VS Code
const vscodeDir = path.join(tempDir, '.vscode');
fs.mkdirSync(vscodeDir, { recursive: true });
const vscodeMcpConfig = {
  servers: {
    "demo-filesystem": {
      url: "http://localhost:8080",
      description: "Demo filesystem server",
      commands: {
        "read_file": {},
        "write_file": {},
        "list_directory": {}
      }
    }
  }
};
fs.writeFileSync(path.join(vscodeDir, 'mcp.json'), JSON.stringify(vscodeMcpConfig, null, 2));
console.log(`${colors.green}✓${colors.reset} Created VS Code MCP configuration`);

// 2. Cursor
const cursorDir = path.join(tempDir, '.cursor');
fs.mkdirSync(cursorDir, { recursive: true });
const cursorMcpConfig = {
  servers: {
    "demo-terminal": {
      url: "http://localhost:8081",
      description: "Demo terminal server",
      commands: {
        "run_command": {},
        "get_output": {}
      }
    }
  }
};
fs.writeFileSync(path.join(cursorDir, 'mcp.json'), JSON.stringify(cursorMcpConfig, null, 2));
console.log(`${colors.green}✓${colors.reset} Created Cursor MCP configuration`);

// 3. Claude
const claudeDir = path.join(tempDir, '.claude');
fs.mkdirSync(claudeDir, { recursive: true });
const claudeMcpConfig = {
  servers: {
    "demo-memory": {
      url: "http://localhost:8082",
      description: "Demo memory server",
      commands: {
        "store_memory": {},
        "retrieve_memory": {},
        "list_memories": {}
      }
    }
  }
};
fs.writeFileSync(path.join(claudeDir, 'settings.json'), JSON.stringify(claudeMcpConfig, null, 2));
console.log(`${colors.green}✓${colors.reset} Created Claude MCP configuration`);

// Create AI rules directory
const rulesDir = path.join(tempDir, '.ai', 'rules');
fs.mkdirSync(rulesDir, { recursive: true });

// Copy the template MCP configuration file
try {
  const templatePath = path.join(__dirname, '..', 'templates', 'rules', '03-mcp-configuration.mdc');
  const targetPath = path.join(rulesDir, '03-mcp-configuration.mdc');
  fs.copyFileSync(templatePath, targetPath);
  console.log(`${colors.green}✓${colors.reset} Copied MCP configuration template to rules directory`);
} catch (error) {
  console.error(`${colors.red}Failed to copy template: ${error.message}${colors.reset}`);
  // Create a minimal version if copying failed
  fs.writeFileSync(path.join(rulesDir, '03-mcp-configuration.mdc'), `---
description: MCP configuration
---
# MCP Server Configuration
`);
}

console.log(`\n${colors.bright}Detecting editor configurations...${colors.reset}`);

// Detect IDE configurations
const detectedIDEs = ideConfig.detectIDEs(tempDir);
if (detectedIDEs.length > 0) {
  console.log(`Found ${detectedIDEs.length} editor configurations:`);
  detectedIDEs.forEach(ide => {
    console.log(`${colors.green}• ${ide.name}${colors.reset} (${ide.configFolder})`);
  });
} else {
  console.log(`${colors.yellow}No editor configurations detected${colors.reset}`);
}

console.log(`\n${colors.bright}Getting editor configuration paths...${colors.reset}`);

// Get all editor config paths
const editorPaths = editorPathResolver.getAllEditorConfigPaths(tempDir);
Object.keys(editorPaths).forEach(ideId => {
  const editor = editorPaths[ideId];
  if (editor.projectConfigPath || editor.globalConfigPath) {
    console.log(`\n${colors.cyan}${editor.name}:${colors.reset}`);
    if (editor.projectConfigPath) {
      console.log(`  Project config: ${editor.projectConfigPath}`);
    }
    if (editor.globalConfigPath) {
      console.log(`  Global config: ${editor.globalConfigPath}`);
    }
    if (editor.rulesFolder) {
      console.log(`  Rules folder: ${editor.rulesFolder}`);
    }
  }
});

console.log(`\n${colors.bright}Updating MCP configuration...${colors.reset}`);

// Update MCP configuration
const success = editorPathResolver.updateMCPConfigurationFile(tempDir, rulesDir);
if (success) {
  console.log(`${colors.green}✓${colors.reset} Successfully updated MCP configuration`);

  // Read and display the updated content
  const mcpFilePath = path.join(rulesDir, '03-mcp-configuration.mdc');
  const mcpContent = fs.readFileSync(mcpFilePath, 'utf8');

  console.log(`\n${colors.bright}Content of updated MCP configuration file:${colors.reset}`);
  console.log(`${colors.dim}------------------------------------------------${colors.reset}`);

  // Extract and print only the Editor Configuration Paths section
  const sectionRegex = /## Editor Configuration Paths\s+[\s\S]*?(?=##|$)/;
  const match = mcpContent.match(sectionRegex);

  if (match) {
    console.log(match[0]);
  } else {
    console.log(`${colors.yellow}Editor Configuration Paths section not found${colors.reset}`);
  }

  console.log(`${colors.dim}------------------------------------------------${colors.reset}`);
} else {
  console.log(`${colors.red}Failed to update MCP configuration${colors.reset}`);
}

console.log(`\n${colors.bright}Clean up...${colors.reset}`);

// Clean up the temporary directory
try {
  // Comment this out if you want to inspect the temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log(`${colors.green}✓${colors.reset} Removed temporary directory: ${tempDir}`);
} catch (error) {
  console.error(`${colors.red}Failed to remove temporary directory: ${error.message}${colors.reset}`);
}

console.log(`\n${colors.bright}${colors.green}Demo completed successfully!${colors.reset}`);
console.log(`You can now use the editor path integration in your projects.`);
console.log(`Run ./update-mcp-config.sh in your VibeKit VDK CLI project to update the MCP configuration.\n`);
