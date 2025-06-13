# CodePilotRules Sync System

The CodePilotRules Sync System allows you to automatically download and synchronize AI rules from the remote repository at [https://github.com/idominikosgr/AI.rules](https://github.com/idominikosgr/AI.rules). This ensures you always have the latest, most up-to-date rules for your AI assistants.

## Overview

The sync system consists of three main components:

1. **Manual Sync** (`rule-sync.js`) - On-demand synchronization with conflict resolution
2. **Auto Sync** (`auto-sync.js`) - Automated background synchronization
3. **Wizard Integration** - Built-in sync support in the setup wizard

## Quick Start

### Initial Setup

1. **Initialize sync configuration:**
   ```bash
   npm run sync-init
   ```

2. **Perform your first sync:**
   ```bash
   npm run sync
   ```

3. **Use the wizard with remote sync:**
   ```bash
   npm run wizard
   # Select "☁️ Remote" or enable "Sync with remote rules repository"
   ```

## Manual Sync Commands

### Basic Commands

```bash
# Sync with remote repository
npm run sync

# Force sync (ignore local changes)
npm run sync-force

# Check sync status
npm run sync-status

# Initialize sync configuration
npm run sync-init
```

### Advanced Usage

```bash
# Run sync directly with options
node tools/sync/rule-sync.js sync --force
node tools/sync/rule-sync.js status
node tools/sync/rule-sync.js init
```

## Automatic Sync

### Setup Auto-Sync

1. **Initialize with auto-sync enabled:**
   ```bash
   npm run sync-init
   # Choose "Enable automatic sync checking? Yes"
   ```

2. **Check auto-sync status:**
   ```bash
   npm run auto-sync-status
   ```

3. **Run a single auto-sync check:**
   ```bash
   npm run auto-sync
   ```

### Running as a Service

#### macOS (launchd)

```bash
# Create service files
npm run install-sync-service

# Install the service
cp /tmp/com.codepilot.autosync.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.codepilot.autosync.plist

# Check service status
launchctl list | grep codepilot
```

#### Linux (systemd)

```bash
# Create service files
npm run install-sync-service

# Install the service
sudo cp /tmp/codepilot-autosync.service /etc/systemd/system/
sudo systemctl enable codepilot-autosync.service
sudo systemctl start codepilot-autosync.service

# Check service status
sudo systemctl status codepilot-autosync.service
```

#### Manual Daemon

```bash
# Run daemon with default 60-minute interval
npm run auto-sync-daemon

# Run daemon with custom interval (30 minutes)
node tools/sync/auto-sync.js daemon 30
```

## Conflict Resolution

When local files differ from remote files, the sync system offers several resolution strategies:

### Resolution Modes

1. **Prompt** (Default) - Ask user for each conflict
2. **Remote** - Always use remote version
3. **Local** - Always keep local version  
4. **Backup** - Create backup and use remote version

### Interactive Resolution

When conflicts are detected, you'll see options like:

```
Conflict detected for: templates/rules/00-core-agent.mdc
Local file modified: 2024-01-15T10:30:00.000Z
Remote file hash: a1b2c3d4...
Local file hash:  e5f6g7h8...

How would you like to resolve this conflict?
❯ Use remote version (overwrite local)
  Keep local version (skip update)
  Create backup and use remote
  Show diff and decide
```

### Backup Files

When using backup mode, files are saved with timestamps:
```
templates/rules/00-core-agent.mdc.backup.1705312200000
```

## Configuration

### Sync Configuration File

The sync system stores configuration in `tools/sync/sync-config.json`:

```json
{
  "lastSync": "2024-01-15T10:30:00.000Z",
  "remoteCommitSha": "a1b2c3d4e5f6g7h8...",
  "syncedFiles": {
    "templates/rules/00-core-agent.mdc": {
      "hash": "sha256hash...",
      "lastSync": "2024-01-15T10:30:00.000Z",
      "size": 3072
    }
  },
  "conflictResolution": "prompt",
  "autoSync": true,
  "syncInterval": 86400000,
  "excludePatterns": [".DS_Store", "*.tmp", "*.log"],
  "includePatterns": ["**/*.mdc", "**/*.md"]
}
```

### Configuration Options

- **`conflictResolution`**: How to handle conflicts (`prompt`, `remote`, `local`, `backup`)
- **`autoSync`**: Enable automatic sync checking
- **`syncInterval`**: Time between auto-sync checks (milliseconds)
- **`excludePatterns`**: Files to ignore during sync
- **`includePatterns`**: Files to include during sync

## Wizard Integration

### Setup Modes with Sync

The setup wizard now includes sync integration:

1. **🔍 Automatic** - Scan project + optional remote sync
2. **🔧 Manual** - Manual selection + optional remote sync  
3. **🔄 Hybrid** - Auto-scan with manual adjustments + optional remote sync
4. **☁️ Remote** - Download latest rules from repository

### Remote Mode

Remote mode is the simplest way to get started:

```bash
npm run wizard
# Select "☁️ Remote (Download latest rules from repository)"
```

This will:
1. Auto-detect your IDE
2. Download the latest rules from the remote repository
3. Install them in the correct location
4. Set up MCP configuration

## File Structure

### Local Files

```
CodePilotRules/
├── templates/                    # Local rule templates (synced from remote)
│   ├── rules/                   # Core rule files
│   ├── languages/               # Language-specific rules
│   ├── technologies/            # Technology-specific rules
│   └── frameworks/              # Framework-specific rules
├── tools/sync/                  # Sync system
│   ├── rule-sync.js            # Main sync functionality
│   ├── auto-sync.js            # Automatic sync service
│   ├── sync-config.json        # Sync configuration
│   └── sync.log                # Sync activity log
└── .ai/rules/                   # Generated rules (IDE-specific)
```

### Remote Repository Structure

The remote repository at [https://github.com/idominikosgr/AI.rules](https://github.com/idominikosgr/AI.rules) contains:

```
AI.rules/
└── .ai/rules/                   # Rule files organized by category
    ├── languages/               # Language-specific rules
    ├── technologies/            # Technology-specific rules
    ├── frameworks/              # Framework-specific rules
    ├── stacks/                  # Full-stack configurations
    ├── tools/                   # AI assistant tools
    └── core/                    # Core rule files
```

## Monitoring and Logging

### Log Files

- **`tools/sync/sync.log`** - Detailed sync activity log
- **`/tmp/codepilot-autosync.log`** - Auto-sync daemon output (macOS)
- **`journalctl -u codepilot-autosync`** - Auto-sync daemon output (Linux)

### Status Checking

```bash
# Check manual sync status
npm run sync-status

# Check auto-sync status  
npm run auto-sync-status

# View recent sync activity
tail -f tools/sync/sync.log
```

## Troubleshooting

### Common Issues

#### Network Connectivity

```bash
# Test GitHub API access
curl -s https://api.github.com/repos/idominikosgr/AI.rules

# Test raw file access
curl -s https://raw.githubusercontent.com/idominikosgr/AI.rules/main/.ai/rules/00-core-agent.mdc
```

#### Permission Issues

```bash
# Check file permissions
ls -la tools/sync/
ls -la templates/

# Fix permissions if needed
chmod +x tools/sync/*.js
chmod -R u+w templates/
```

#### Sync Configuration Issues

```bash
# Reset sync configuration
rm tools/sync/sync-config.json
npm run sync-init

# View current configuration
cat tools/sync/sync-config.json
```

### Error Messages

#### "Failed to get remote repository info"
- Check internet connection
- Verify GitHub API access
- Check if repository exists and is public

#### "HTTP 403: API rate limit exceeded"
- Wait for rate limit reset (usually 1 hour)
- Consider using GitHub token for higher limits

#### "Sync failed: ENOENT"
- Check file permissions
- Ensure target directories exist
- Verify disk space

## Best Practices

### Development Workflow

1. **Start with remote sync:**
   ```bash
   npm run wizard
   # Select "☁️ Remote" mode
   ```

2. **Enable auto-sync for updates:**
   ```bash
   npm run sync-init
   # Enable automatic sync checking
   ```

3. **Customize rules locally:**
   - Edit files in your IDE's rules directory (e.g., `.ai/rules/`)
   - Keep templates as reference only

4. **Periodic manual sync:**
   ```bash
   npm run sync-status
   npm run sync  # if updates available
   ```

### Production Deployment

1. **Set up auto-sync service:**
   ```bash
   npm run install-sync-service
   # Follow platform-specific installation steps
   ```

2. **Configure conflict resolution:**
   ```bash
   npm run sync-init
   # Choose "Always use remote version" for production
   ```

3. **Monitor sync activity:**
   ```bash
   # Set up log monitoring
   tail -f tools/sync/sync.log
   ```

## API Reference

### rule-sync.js

```javascript
const { performSync, checkSyncStatus, loadSyncConfig } = require('./tools/sync/rule-sync');

// Perform sync
const result = await performSync({ force: false });

// Check if sync is needed
const status = await checkSyncStatus();

// Load configuration
const config = loadSyncConfig();
```

### auto-sync.js

```javascript
const { performAutoSync, shouldRunAutoSync } = require('./tools/sync/auto-sync');

// Check if auto-sync should run
const shouldSync = shouldRunAutoSync();

// Perform automatic sync
const result = await performAutoSync();
```

## Contributing

To contribute to the sync system:

1. **Test sync functionality:**
   ```bash
   npm run sync-status
   npm run sync
   npm run auto-sync
   ```

2. **Add new sync features:**
   - Extend `rule-sync.js` for core functionality
   - Extend `auto-sync.js` for automation features
   - Update configuration schema as needed

3. **Update documentation:**
   - Update this file for new features
   - Add examples for new use cases
   - Update troubleshooting section

## Security Considerations

- Rules are downloaded over HTTPS from GitHub
- No authentication tokens are stored by default
- Local files are backed up before overwriting
- Sync logs may contain file paths (review before sharing)
- Auto-sync daemon runs with user permissions

## License

The sync system is part of CodePilotRules and follows the same MIT license. Remote rules from [AI.rules repository](https://github.com/idominikosgr/AI.rules) may have their own licensing terms. 