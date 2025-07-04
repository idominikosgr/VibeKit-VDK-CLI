#!/usr/bin/env node

/**
 * VDK Rules Sync Tool
 * ------------------------
 * Synchronizes local rule files with the remote repository
 * Supports initial download, updates, and conflict resolution
 * 
 * Repository: https://github.com/idominikosgr/VibeKit-VDK-AI-rules
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';
import { exec } from 'child_process';
import ora from 'ora';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const REMOTE_REPO = 'https://api.github.com/repos/idominikosgr/VibeKit-VDK-AI-rules';
const REMOTE_RAW_BASE = 'https://raw.githubusercontent.com/idominikosgr/VibeKit-VDK-AI-rules/main';
const LOCAL_RULES_BASE = path.join(__dirname, '..', '..', 'templates');
const SYNC_CONFIG_FILE = path.resolve(__dirname, '../../vdk.config.json');
const SYNC_LOG_FILE = path.join(__dirname, 'sync.log');

// Colors for CLI output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

/**
 * Sync configuration structure
 */
const defaultSyncConfig = {
  lastSync: null,
  remoteCommitSha: null,
  syncedFiles: {},
  conflictResolution: 'prompt', // 'prompt', 'remote', 'local', 'backup'
  autoSync: false,
  syncInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  excludePatterns: ['.DS_Store', '*.tmp', '*.log'],
  includePatterns: ['**/*.mdc', '**/*.md']
};

/**
 * Load sync configuration
 */
function loadSyncConfig() {
  try {
    if (fs.existsSync(SYNC_CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(SYNC_CONFIG_FILE, 'utf8'));
      return { ...defaultSyncConfig, ...config };
    }
  } catch (error) {
    console.warn(`${colors.yellow}Warning: Could not load sync config, using defaults${colors.reset}`);
  }
  return { ...defaultSyncConfig };
}

/**
 * Save sync configuration
 */
function saveSyncConfig(config) {
  try {
    fs.writeFileSync(SYNC_CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error(`${colors.red}Error saving sync config:${colors.reset} ${error.message}`);
  }
}

/**
 * Log sync activity
 */
function logActivity(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  try {
    fs.appendFileSync(SYNC_LOG_FILE, logEntry);
  } catch (error) {
    // Ignore logging errors
  }
  
  if (level === 'error') {
    console.error(`${colors.red}${message}${colors.reset}`);
  } else if (level === 'warn') {
    console.warn(`${colors.yellow}${message}${colors.reset}`);
  } else {
    console.log(message);
  }
}

/**
 * Make HTTP request with promise
 */
function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      headers: {
        'User-Agent': 'VDK-Sync/1.0.0',
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers
      },
      ...options
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = options.raw ? data : JSON.parse(data);
            resolve(parsed);
          } catch (error) {
            resolve(data); // Return raw data if JSON parsing fails
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

/**
 * Get remote repository information
 */
async function getRemoteRepoInfo() {
  try {
    const repoInfo = await httpRequest(REMOTE_REPO);
    return {
      lastCommitSha: repoInfo.default_branch ? await getLatestCommitSha() : null,
      updatedAt: repoInfo.updated_at,
      size: repoInfo.size
    };
  } catch (error) {
    throw new Error(`Failed to get remote repository info: ${error.message}`);
  }
}

/**
 * Get latest commit SHA from the main branch
 */
async function getLatestCommitSha() {
  try {
    const commits = await httpRequest(`${REMOTE_REPO}/commits?per_page=1`);
    return commits[0]?.sha || null;
  } catch (error) {
    throw new Error(`Failed to get latest commit: ${error.message}`);
  }
}

/**
 * Get remote file tree
 */
async function getRemoteFileTree() {
  try {
    const tree = await httpRequest(`${REMOTE_REPO}/git/trees/main?recursive=1`);
    return tree.tree.filter(item => 
      item.type === 'blob' && 
      (item.path.endsWith('.mdc') || item.path.endsWith('.md'))
    );
  } catch (error) {
    throw new Error(`Failed to get remote file tree: ${error.message}`);
  }
}

/**
 * Download a single file from remote repository
 */
async function downloadRemoteFile(filePath) {
  try {
    const url = `${REMOTE_RAW_BASE}/${filePath}`;
    const content = await httpRequest(url, { raw: true });
    return content;
  } catch (error) {
    throw new Error(`Failed to download ${filePath}: ${error.message}`);
  }
}

/**
 * Calculate file hash for change detection
 */
function calculateFileHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Check if local file exists and get its hash
 */
function getLocalFileInfo(filePath) {
  const fullPath = path.join(LOCAL_RULES_BASE, filePath);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hash = calculateFileHash(content);
    const stats = fs.statSync(fullPath);
    
    return {
      path: fullPath,
      content,
      hash,
      modifiedTime: stats.mtime,
      size: stats.size
    };
  } catch (error) {
    return null;
  }
}

/**
 * Ensure directory exists
 */
function ensureDirectory(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Create backup of local file
 */
function createBackup(filePath) {
  const backupPath = `${filePath}.backup.${Date.now()}`;
  try {
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  } catch (error) {
    logActivity(`Failed to create backup for ${filePath}: ${error.message}`, 'warn');
    return null;
  }
}

/**
 * Handle file conflict resolution
 */
async function resolveConflict(filePath, localInfo, remoteContent, config) {
  const remoteHash = calculateFileHash(remoteContent);
  
  if (localInfo.hash === remoteHash) {
    return 'skip'; // Files are identical
  }
  
  switch (config.conflictResolution) {
    case 'remote':
      return 'use_remote';
    
    case 'local':
      return 'keep_local';
    
    case 'backup':
      createBackup(localInfo.path);
      return 'use_remote';
    
    case 'prompt':
    default:
      // Interactive conflict resolution
      console.log(`\n${colors.bright}${colors.yellow}Conflict detected for: ${colors.cyan}${filePath}${colors.reset}`);
      console.log(`Local file modified: ${localInfo.modifiedTime.toISOString()}`);
      console.log(`Remote file hash: ${remoteHash.substring(0, 8)}...`);
      console.log(`Local file hash:  ${localInfo.hash.substring(0, 8)}...`);
      
      const prompt = require('inquirer').createPromptModule();
      const { resolution } = await prompt([{
        type: 'list',
        name: 'resolution',
        message: 'How would you like to resolve this conflict?',
        choices: [
          { name: 'Use remote version (overwrite local)', value: 'use_remote' },
          { name: 'Keep local version (skip update)', value: 'keep_local' },
          { name: 'Create backup and use remote', value: 'backup_and_remote' },
          { name: 'Show diff and decide', value: 'show_diff' }
        ]
      }]);
      
      if (resolution === 'backup_and_remote') {
        createBackup(localInfo.path);
        return 'use_remote';
      } else if (resolution === 'show_diff') {
        // Show a simple diff (could be enhanced with a proper diff library)
        console.log(`\n${colors.bright}Local content (first 500 chars):${colors.reset}`);
        console.log(localInfo.content.substring(0, 500));
        console.log(`\n${colors.bright}Remote content (first 500 chars):${colors.reset}`);
        console.log(remoteContent.substring(0, 500));
        
        const { finalChoice } = await prompt([{
          type: 'list',
          name: 'finalChoice',
          message: 'After reviewing the diff, what would you like to do?',
          choices: [
            { name: 'Use remote version', value: 'use_remote' },
            { name: 'Keep local version', value: 'keep_local' }
          ]
        }]);
        
        return finalChoice;
      }
      
      return resolution;
  }
}

/**
 * Sync a single file
 */
async function syncFile(remoteFile, config) {
  const filePath = remoteFile.path;
  const localInfo = getLocalFileInfo(filePath);
  
  try {
    const remoteContent = await downloadRemoteFile(filePath);
    const remoteHash = calculateFileHash(remoteContent);
    
    // Check if file needs updating
    if (localInfo && localInfo.hash === remoteHash) {
      return { status: 'unchanged', path: filePath };
    }
    
    let action = 'update';
    
    // Handle conflicts if local file exists and is different
    if (localInfo) {
      const resolution = await resolveConflict(filePath, localInfo, remoteContent, config);
      
      if (resolution === 'keep_local' || resolution === 'skip') {
        return { status: 'skipped', path: filePath, reason: 'user_choice' };
      }
      
      action = 'conflict_resolved';
    } else {
      action = 'new';
    }
    
    // Write the file
    const fullPath = path.join(LOCAL_RULES_BASE, filePath);
    ensureDirectory(fullPath);
    fs.writeFileSync(fullPath, remoteContent, 'utf8');
    
    // Update sync config
    config.syncedFiles[filePath] = {
      hash: remoteHash,
      lastSync: new Date().toISOString(),
      size: remoteContent.length
    };
    
    return { status: action, path: filePath, size: remoteContent.length };
    
  } catch (error) {
    return { status: 'error', path: filePath, error: error.message };
  }
}

/**
 * Perform full synchronization
 */
async function performSync(options = {}) {
  const config = loadSyncConfig();
  const spinner = ora('Checking remote repository...').start();
  
  try {
    // Get remote repository info
    const repoInfo = await getRemoteRepoInfo();
    
    // Check if sync is needed
    if (!options.force && config.remoteCommitSha === repoInfo.lastCommitSha) {
      spinner.succeed('Repository is up to date');
      return { status: 'up_to_date', filesProcessed: 0 };
    }
    
    spinner.text = 'Getting remote file list...';
    const remoteFiles = await getRemoteFileTree();
    
    spinner.text = 'Synchronizing files...';
    
    const results = {
      new: [],
      updated: [],
      unchanged: [],
      skipped: [],
      errors: []
    };
    
    // Process each remote file
    for (let i = 0; i < remoteFiles.length; i++) {
      const file = remoteFiles[i];
      spinner.text = `Syncing ${file.path} (${i + 1}/${remoteFiles.length})`;
      
      const result = await syncFile(file, config);
      
      switch (result.status) {
        case 'new':
          results.new.push(result);
          break;
        case 'update':
        case 'conflict_resolved':
          results.updated.push(result);
          break;
        case 'unchanged':
          results.unchanged.push(result);
          break;
        case 'skipped':
          results.skipped.push(result);
          break;
        case 'error':
          results.errors.push(result);
          break;
      }
    }
    
    // Update sync configuration
    config.lastSync = new Date().toISOString();
    config.remoteCommitSha = repoInfo.lastCommitSha;
    saveSyncConfig(config);
    
    spinner.succeed('Synchronization completed');
    
    // Display results
    console.log(`\n${colors.bright}${colors.green}Sync Results:${colors.reset}`);
    console.log(`${colors.green}✓${colors.reset} New files: ${results.new.length}`);
    console.log(`${colors.blue}↑${colors.reset} Updated files: ${results.updated.length}`);
    console.log(`${colors.gray}−${colors.reset} Unchanged files: ${results.unchanged.length}`);
    console.log(`${colors.yellow}→${colors.reset} Skipped files: ${results.skipped.length}`);
    console.log(`${colors.red}✗${colors.reset} Errors: ${results.errors.length}`);
    
    // Show details for new and updated files
    if (results.new.length > 0) {
      console.log(`\n${colors.bright}New files:${colors.reset}`);
      results.new.forEach(r => console.log(`  ${colors.green}+${colors.reset} ${r.path}`));
    }
    
    if (results.updated.length > 0) {
      console.log(`\n${colors.bright}Updated files:${colors.reset}`);
      results.updated.forEach(r => console.log(`  ${colors.blue}↑${colors.reset} ${r.path}`));
    }
    
    if (results.errors.length > 0) {
      console.log(`\n${colors.bright}Errors:${colors.reset}`);
      results.errors.forEach(r => console.log(`  ${colors.red}✗${colors.reset} ${r.path}: ${r.error}`));
    }
    
    logActivity(`Sync completed: ${results.new.length} new, ${results.updated.length} updated, ${results.errors.length} errors`);
    
    return {
      status: 'completed',
      filesProcessed: results.new.length + results.updated.length,
      results
    };
    
  } catch (error) {
    spinner.fail('Synchronization failed');
    logActivity(`Sync failed: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Check if sync is needed (without performing it)
 */
async function checkSyncStatus() {
  try {
    const config = loadSyncConfig();
    const repoInfo = await getRemoteRepoInfo();
    
    const needsSync = !config.remoteCommitSha || config.remoteCommitSha !== repoInfo.lastCommitSha;
    const lastSyncDate = config.lastSync ? new Date(config.lastSync) : null;
    
    return {
      needsSync,
      lastSync: lastSyncDate,
      remoteCommit: repoInfo.lastCommitSha,
      localCommit: config.remoteCommitSha
    };
  } catch (error) {
    throw new Error(`Failed to check sync status: ${error.message}`);
  }
}

/**
 * Initialize sync configuration
 */
async function initializeSync() {
  console.log(`${colors.bright}${colors.cyan}Initializing VDK Rules Sync${colors.reset}`);
  
  const prompt = inquirer.createPromptModule();
  
  const answers = await prompt([
    {
      type: 'list',
      name: 'conflictResolution',
      message: 'How should conflicts be resolved by default?',
      choices: [
        { name: 'Prompt me each time (recommended)', value: 'prompt' },
        { name: 'Always use remote version', value: 'remote' },
        { name: 'Always keep local version', value: 'local' },
        { name: 'Create backup and use remote', value: 'backup' }
      ],
      default: 'prompt'
    },
    {
      type: 'confirm',
      name: 'autoSync',
      message: 'Enable automatic sync checking?',
      default: false
    }
  ]);
  
  const config = {
    ...defaultSyncConfig,
    ...answers,
    initialized: true,
    initDate: new Date().toISOString()
  };
  
  saveSyncConfig(config);
  
  console.log(`${colors.green}✓${colors.reset} Sync configuration saved`);
  console.log(`\nRun ${colors.cyan}npm run sync${colors.reset} to perform your first sync`);
}

/**
 * Main CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'sync';
  
  try {
    switch (command) {
      case 'init':
        await initializeSync();
        break;
        
      case 'sync':
        const force = args.includes('--force');
        await performSync({ force });
        break;
        
      case 'status':
        const status = await checkSyncStatus();
        console.log(`${colors.bright}Sync Status:${colors.reset}`);
        console.log(`Needs sync: ${status.needsSync ? colors.yellow + 'Yes' + colors.reset : colors.green + 'No' + colors.reset}`);
        console.log(`Last sync: ${status.lastSync ? status.lastSync.toISOString() : colors.gray + 'Never' + colors.reset}`);
        console.log(`Remote commit: ${status.remoteCommit ? status.remoteCommit.substring(0, 8) + '...' : colors.gray + 'Unknown' + colors.reset}`);
        break;
        
      case 'help':
      default:
        console.log(`${colors.bright}VDK Rules Sync Tool${colors.reset}`);
        console.log(`\nUsage: node rule-sync.js [command] [options]`);
        console.log(`\nCommands:`);
        console.log(`  init     Initialize sync configuration`);
        console.log(`  sync     Synchronize with remote repository`);
        console.log(`  status   Check sync status`);
        console.log(`  help     Show this help message`);
        console.log(`\nOptions:`);
        console.log(`  --force  Force sync even if no changes detected`);
        break;
    }
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Export functions for use in other modules
export {
  performSync,
  checkSyncStatus,
  initializeSync,
  loadSyncConfig,
  saveSyncConfig
};

// Run CLI if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 