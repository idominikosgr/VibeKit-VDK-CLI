#!/usr/bin/env node

/**
 * CodePilotRules Auto-Sync Service
 * --------------------------------
 * Automatically checks for and applies rule updates from the remote repository
 * Can be run as a scheduled task or daemon process
 * 
 * Repository: https://github.com/idominikosgr/AI.rules
 */

const fs = require('fs');
const path = require('path');
const { performSync, checkSyncStatus, loadSyncConfig } = require('./rule-sync');

// Colors for CLI output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

/**
 * Log with timestamp
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [AUTO-SYNC]`;
  
  switch (level) {
    case 'error':
      console.error(`${colors.red}${prefix} ERROR: ${message}${colors.reset}`);
      break;
    case 'warn':
      console.warn(`${colors.yellow}${prefix} WARN: ${message}${colors.reset}`);
      break;
    case 'success':
      console.log(`${colors.green}${prefix} SUCCESS: ${message}${colors.reset}`);
      break;
    case 'info':
    default:
      console.log(`${colors.blue}${prefix} INFO: ${message}${colors.reset}`);
      break;
  }
}

/**
 * Check if auto-sync should run based on configuration
 */
function shouldRunAutoSync() {
  try {
    const config = loadSyncConfig();
    
    if (!config.autoSync) {
      return { should: false, reason: 'Auto-sync is disabled' };
    }
    
    if (!config.lastSync) {
      return { should: true, reason: 'No previous sync found' };
    }
    
    const lastSyncTime = new Date(config.lastSync);
    const now = new Date();
    const timeSinceLastSync = now - lastSyncTime;
    const syncInterval = config.syncInterval || (24 * 60 * 60 * 1000); // Default 24 hours
    
    if (timeSinceLastSync >= syncInterval) {
      return { 
        should: true, 
        reason: `Last sync was ${Math.round(timeSinceLastSync / (60 * 60 * 1000))} hours ago` 
      };
    }
    
    return { 
      should: false, 
      reason: `Next sync in ${Math.round((syncInterval - timeSinceLastSync) / (60 * 60 * 1000))} hours` 
    };
    
  } catch (error) {
    return { should: false, reason: `Configuration error: ${error.message}` };
  }
}

/**
 * Perform automatic sync with error handling
 */
async function performAutoSync() {
  try {
    log('Starting automatic sync check...');
    
    // Check if sync is needed
    const status = await checkSyncStatus();
    
    if (!status.needsSync) {
      log('Repository is up to date, no sync needed');
      return { success: true, action: 'no_sync_needed' };
    }
    
    log(`Remote changes detected (${status.remoteCommit?.substring(0, 8)}...), starting sync...`);
    
    // Perform the sync
    const result = await performSync({ force: false });
    
    if (result.status === 'completed') {
      log(`Sync completed successfully: ${result.filesProcessed} files processed`, 'success');
      return { success: true, action: 'synced', filesProcessed: result.filesProcessed };
    } else if (result.status === 'up_to_date') {
      log('Repository confirmed up to date');
      return { success: true, action: 'up_to_date' };
    } else {
      log(`Sync completed with status: ${result.status}`, 'warn');
      return { success: true, action: result.status };
    }
    
  } catch (error) {
    log(`Auto-sync failed: ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

/**
 * Run auto-sync daemon (continuous monitoring)
 */
async function runDaemon(intervalMinutes = 60) {
  log(`Starting auto-sync daemon (checking every ${intervalMinutes} minutes)`);
  
  const intervalMs = intervalMinutes * 60 * 1000;
  
  // Initial check
  await runSingleCheck();
  
  // Set up periodic checks
  setInterval(async () => {
    await runSingleCheck();
  }, intervalMs);
  
  // Keep the process alive
  process.on('SIGINT', () => {
    log('Auto-sync daemon shutting down...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('Auto-sync daemon shutting down...');
    process.exit(0);
  });
}

/**
 * Run a single sync check
 */
async function runSingleCheck() {
  try {
    const shouldSync = shouldRunAutoSync();
    
    if (!shouldSync.should) {
      log(`Skipping sync: ${shouldSync.reason}`, 'info');
      return;
    }
    
    log(`Running sync: ${shouldSync.reason}`);
    const result = await performAutoSync();
    
    if (result.success) {
      if (result.action === 'synced') {
        log(`Auto-sync successful: ${result.filesProcessed} files updated`, 'success');
      } else {
        log(`Auto-sync completed: ${result.action}`, 'info');
      }
    } else {
      log(`Auto-sync failed: ${result.error}`, 'error');
    }
    
  } catch (error) {
    log(`Auto-sync check failed: ${error.message}`, 'error');
  }
}

/**
 * Create a systemd service file for Linux systems
 */
function createSystemdService() {
  const serviceContent = `[Unit]
Description=CodePilotRules Auto-Sync Service
After=network.target

[Service]
Type=simple
User=${process.env.USER || 'root'}
WorkingDirectory=${process.cwd()}
ExecStart=${process.execPath} ${__filename} daemon
Restart=always
RestartSec=30
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
`;

  const servicePath = '/tmp/codepilot-autosync.service';
  fs.writeFileSync(servicePath, serviceContent);
  
  console.log(`${colors.green}✓${colors.reset} Systemd service file created: ${servicePath}`);
  console.log(`\nTo install the service:`);
  console.log(`${colors.cyan}sudo cp ${servicePath} /etc/systemd/system/${colors.reset}`);
  console.log(`${colors.cyan}sudo systemctl enable codepilot-autosync.service${colors.reset}`);
  console.log(`${colors.cyan}sudo systemctl start codepilot-autosync.service${colors.reset}`);
}

/**
 * Create a launchd plist file for macOS systems
 */
function createLaunchdPlist() {
  const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.codepilot.autosync</string>
    <key>ProgramArguments</key>
    <array>
        <string>${process.execPath}</string>
        <string>${__filename}</string>
        <string>daemon</string>
    </array>
    <key>WorkingDirectory</key>
    <string>${process.cwd()}</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/codepilot-autosync.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/codepilot-autosync.error.log</string>
</dict>
</plist>
`;

  const plistPath = `/tmp/com.codepilot.autosync.plist`;
  fs.writeFileSync(plistPath, plistContent);
  
  console.log(`${colors.green}✓${colors.reset} Launchd plist file created: ${plistPath}`);
  console.log(`\nTo install the service:`);
  console.log(`${colors.cyan}cp ${plistPath} ~/Library/LaunchAgents/${colors.reset}`);
  console.log(`${colors.cyan}launchctl load ~/Library/LaunchAgents/com.codepilot.autosync.plist${colors.reset}`);
}

/**
 * Main CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';
  
  try {
    switch (command) {
      case 'check':
        await runSingleCheck();
        break;
        
      case 'daemon':
        const interval = parseInt(args[1]) || 60;
        await runDaemon(interval);
        break;
        
      case 'status':
        const shouldSync = shouldRunAutoSync();
        const syncStatus = await checkSyncStatus();
        
        console.log(`${colors.bright}Auto-Sync Status:${colors.reset}`);
        console.log(`Auto-sync enabled: ${shouldSync.should ? colors.green + 'Yes' + colors.reset : colors.red + 'No' + colors.reset}`);
        console.log(`Reason: ${shouldSync.reason}`);
        console.log(`Remote sync needed: ${syncStatus.needsSync ? colors.yellow + 'Yes' + colors.reset : colors.green + 'No' + colors.reset}`);
        console.log(`Last sync: ${syncStatus.lastSync ? syncStatus.lastSync.toISOString() : colors.gray + 'Never' + colors.reset}`);
        break;
        
      case 'install-service':
        const platform = process.platform;
        if (platform === 'linux') {
          createSystemdService();
        } else if (platform === 'darwin') {
          createLaunchdPlist();
        } else {
          console.log(`${colors.yellow}Service installation not supported on ${platform}${colors.reset}`);
          console.log(`You can run the daemon manually: ${colors.cyan}node ${__filename} daemon${colors.reset}`);
        }
        break;
        
      case 'help':
      default:
        console.log(`${colors.bright}CodePilotRules Auto-Sync Service${colors.reset}`);
        console.log(`\nUsage: node auto-sync.js [command] [options]`);
        console.log(`\nCommands:`);
        console.log(`  check              Run a single sync check`);
        console.log(`  daemon [interval]  Run as daemon (default: 60 minutes)`);
        console.log(`  status             Show auto-sync status`);
        console.log(`  install-service    Create system service files`);
        console.log(`  help               Show this help message`);
        console.log(`\nExamples:`);
        console.log(`  node auto-sync.js check`);
        console.log(`  node auto-sync.js daemon 30    # Check every 30 minutes`);
        break;
    }
  } catch (error) {
    log(`Command failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Export functions for use in other modules
module.exports = {
  performAutoSync,
  runSingleCheck,
  shouldRunAutoSync
};

// Run CLI if executed directly
if (require.main === module) {
  main();
} 