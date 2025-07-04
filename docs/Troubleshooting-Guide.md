# 🔧 Troubleshooting Guide

This guide helps you resolve common issues with VibeKit VDK CLI setup, configuration, and usage.

## 📋 Table of Contents

1. [Installation Issues](#installation-issues)
2. [Setup Wizard Problems](#setup-wizard-problems)
3. [Rule Generation Issues](#rule-generation-issues)
4. [AI Assistant Integration](#ai-assistant-integration)
5. [Sync System Problems](#sync-system-problems)
6. [IDE-Specific Issues](#ide-specific-issues)
7. [Performance Problems](#performance-problems)
8. [Advanced Diagnostics](#advanced-diagnostics)

## 🚨 Installation Issues

### Node.js Version Errors

**Problem**: Error messages about Node.js version compatibility
```bash
Error: This package requires Node.js version 18.0.0 or higher
```

**Solution**:
1. Check your Node.js version: `node --version`
2. Update Node.js to 18.0.0+ from [nodejs.org](https://nodejs.org/)
3. Restart your terminal and try again

### NPM Installation Failures

**Problem**: `npm install` fails with permission errors or module conflicts

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Alternative: Use pnpm
npm install -g pnpm
pnpm install
```

### Git Clone Issues

**Problem**: Permission denied or repository not found errors

**Solutions**:
```bash
# Use HTTPS instead of SSH
git clone https://github.com/idominikosgr/vdk-cli.git

# Check your Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 🧙‍♂️ Setup Wizard Problems

### Wizard Won't Start

**Problem**: `npm run wizard` command fails or hangs

**Diagnostics**:
```bash
# Check if CLI is working
node cli.js --help

# Run with verbose output
npm run wizard -- --verbose

# Check for conflicting processes
ps aux | grep node
```

**Solutions**:
- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (requires 18+)
- Clear terminal cache and restart: `reset`

### Project Scanning Fails

**Problem**: "No project files detected" or "Scan returned empty results"

**Common Causes & Solutions**:

1. **Empty or new project**
   - Add some code files first
   - Use Manual mode to specify technologies

2. **Permission issues**
   ```bash
   # Check file permissions
   ls -la

   # Run with different permissions
   sudo npm run wizard
   ```

3. **Large project timeout**
   ```bash
   # Increase timeout for large projects
   npm run scan -- --timeout 60000
   ```

### Technology Detection Issues

**Problem**: Wrong technologies detected or missing expected frameworks

**Solutions**:
1. **Manual mode**: Use `🔧 Manual` setup mode for precise control
2. **Add indicator files**: Create clear indicator files (package.json, requirements.txt, etc.)
3. **Check file extensions**: Ensure files have proper extensions (.js, .ts, .py, etc.)

## 📝 Rule Generation Issues

### No Rules Generated

**Problem**: Setup completes but no `.mdc` files are created

**Diagnostics**:
```bash
# Check output directory
ls -la .ai/rules/

# Run scan manually with verbose output
npm run scan -- --verbose --output .ai/rules

# Check template files exist
ls -la templates/rules/
```

**Solutions**:
1. Verify template files exist in `templates/rules/`
2. Check write permissions: `ls -la .ai/`
3. Run with elevated permissions if needed
4. Use manual file creation as fallback

### Rules Not Loading

**Problem**: AI assistant doesn't seem to use generated rules

**Checklist**:
- [ ] Rules exist in correct directory (`.ai/rules/`)
- [ ] Files have `.mdc` extension
- [ ] YAML frontmatter is valid
- [ ] IDE recognizes the rules directory

**Validation**:
```bash
# Validate rule format
npm run validate

# Check rule file structure
head -20 .ai/rules/00-core-agent.mdc
```

### Invalid Rule Format

**Problem**: Generated rules have syntax errors

**Common Issues**:
1. **YAML frontmatter errors**
   ```yaml
   ---
   description: "Valid description in quotes"
   globs: "**/*.js,**/*.ts"  # Comma-separated, no spaces after commas
   alwaysApply: false        # Boolean, not string
   ---
   ```

2. **Missing required fields**
   - `description` is required
   - `version` should be semantic versioning
   - `lastUpdated` should be YYYY-MM-DD format

## 🤖 AI Assistant Integration

### VS Code / Cursor AI Issues

**Problem**: Rules not being applied in VS Code or Cursor

**Solutions**:
1. **Restart IDE completely**
2. **Check correct directory structure**:
   ```
   .ai/rules/          # Standard location
   .cursor/rules/      # Cursor-specific (legacy)
   .vscode/ai-rules/   # VS Code alternative
   ```

3. **Verify file recognition**:
   - Open a rule file and check syntax highlighting
   - Ensure Markdown support is enabled

### GitHub Copilot Integration

**Problem**: Copilot doesn't use rules

**Solutions**:
1. **Manual reference**: Include rule content in comments
2. **Workspace context**: Keep rule files open in workspace
3. **Prompt engineering**: Reference rules explicitly in prompts

### Claude Desktop Issues

**Problem**: Claude doesn't recognize rule files

**Solutions**:
1. **Check MCP configuration**: Verify `claude_desktop_config.json`
2. **Manual upload**: Upload rule files to Claude conversations
3. **File references**: Use `@filename` to reference rules

## 🔄 Sync System Problems

### Sync Fails to Connect

**Problem**: Cannot connect to remote repository

**Diagnostics**:
```bash
# Test internet connection
curl -I https://github.com/idominikosgr/vdk-cli

# Check sync status
npm run sync-status

# Test with verbose output
npm run sync -- --verbose
```

**Solutions**:
1. Check internet connection
2. Verify repository URL is correct
3. Try manual git clone to test access

### Conflict Resolution Issues

**Problem**: Sync conflicts not resolving properly

**Solutions**:
```bash
# Force sync (overwrites local changes)
npm run sync-force

# Reset sync configuration
rm vdk.config.json
npm run sync-init

# Manual conflict resolution
git status
git add .
git commit -m "Resolve sync conflicts"
```

## 💻 IDE-Specific Issues

### JetBrains IDEs

**Problem**: Rules not recognized in IntelliJ, WebStorm, etc.

**Solutions**:
1. **Plugin check**: Ensure AI Assistant plugin is installed
2. **Directory settings**: Configure MCP settings in IDE preferences
3. **File associations**: Associate `.mdc` files with Markdown

### Zed Editor

**Problem**: Zed doesn't load rules

**Solutions**:
1. **Extension check**: Install relevant AI extensions
2. **Configuration**: Check Zed's settings for AI integration
3. **Manual loading**: Reference rules in project settings

### Windsurf Issues

**Problem**: Rules not applying in Windsurf

**Solutions**:
1. **Restart application**: Complete restart often resolves issues
2. **Check configuration**: Verify `~/.codeium/windsurf/mcp_config.json`
3. **Update paths**: Use `npm run update-mcp-config`

## ⚡ Performance Problems

### Slow Project Scanning

**Problem**: Scanning takes very long or times out

**Solutions**:
```bash
# Scan specific directories only
npm run scan -- --path src/ --path components/

# Exclude large directories
npm run scan -- --exclude node_modules --exclude build

# Use shallow scanning
npm run scan -- --shallow
```

### Large Rule Files

**Problem**: Generated rules are excessively large

**Solutions**:
1. **Limit scope**: Focus on specific directories
2. **Filter patterns**: Use more specific glob patterns
3. **Manual editing**: Remove unnecessary sections

### Memory Usage Issues

**Problem**: High memory usage during operation

**Solutions**:
```bash
# Monitor memory usage
node --max-old-space-size=4096 cli.js scan

# Use streaming for large projects
npm run scan -- --stream

# Process in batches
npm run scan -- --batch-size 100
```

## 🔍 Advanced Diagnostics

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
# Run with debug output
DEBUG=vibe-coding-rules* npm run wizard

# Save debug output to file
npm run wizard -- --debug > debug.log 2>&1

# Check specific component
DEBUG=vibe-coding-rules:scanner npm run scan
```

### File System Checks

```bash
# Check file permissions
find .ai/rules -type f -exec ls -la {} \;

# Verify file contents
file .ai/rules/*.mdc

# Check for hidden characters
cat -A .ai/rules/00-core-agent.mdc | head
```

### Network Diagnostics

```bash
# Test GitHub connectivity
nslookup github.com
ping github.com

# Check proxy settings
echo $HTTP_PROXY
echo $HTTPS_PROXY

# Test HTTPS connections
curl -v https://api.github.com
```

## 🆘 Getting Help

If you're still experiencing issues:

1. **Check logs**: Look for error messages in terminal output
2. **Search issues**: Check [GitHub Issues](https://github.com/idominikosgr/vdk-cli/issues)
3. **Create issue**: Report bugs with:
   - Your operating system and version
   - Node.js version (`node --version`)
   - Complete error messages
   - Steps to reproduce the problem
   - Debug output (if possible)

### Issue Template

```markdown
**Environment:**
- OS: [e.g., macOS 13.0, Ubuntu 20.04, Windows 11]
- Node.js: [e.g., v18.15.0]
- IDE: [e.g., VS Code 1.85.0, Cursor 0.28.0]

**Problem:**
[Describe the issue clearly]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [Error occurs]

**Expected Behavior:**
[What should happen]

**Error Messages:**
```
[Paste complete error messages here]
```

**Additional Context:**
[Any other relevant information]
```

---

**Still need help?** Open an issue on [GitHub](https://github.com/idominikosgr/vdk-cli/issues) with detailed information about your problem.