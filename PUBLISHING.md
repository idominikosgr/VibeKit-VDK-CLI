# Publishing Guide for VibeKit VDK CLI

This project is published as a single npm package named `@vdk/cli`.

## Package Structure

```
VibeKit-VDK-CLI/
├── docs/                          # Documentation files
├── src/                           # Source code for rules and templates
├── templates/                     # Default rule templates
├── cli.js                         # Main CLI entry point
├── package.json                   # Project metadata and dependencies
└── GUIDE.md                       # Main user guide
```

## What Users Get

When users install `@vdk/cli`, they get the `vdk` command-line tool, which provides:

- **✨ Interactive Setup Wizard** (`vdk init`)
- **📊 Configuration Status Checker** (`vdk status`)
- **🚀 Rule Deployment System** (`vdk deploy`)
- **🔄 Update Mechanism** (`vdk update`)

## Publishing Steps

### 1. Pre-Publishing Checklist

```bash
# Install dependencies
npm install

# Run linting to check for style issues
npm run lint

# Manually test the CLI commands in a test project
npm link
cd ../my-test-project
vdk init
vdk status
```

### 2. Version Management

Update the version in `package.json` following semantic versioning.

```json
{
  "name": "@vdk/cli",
  "version": "1.0.1" 
}
```

### 3. Publishing to npm

```bash
# Login to npm (if not already logged in)
npm login

# Dry run to see what will be published
npm publish --dry-run

# Publish to npm with public access
npm publish --access public
```

## CLI Commands Available After Installation

| Command      | Description                                                 |
|--------------|-------------------------------------------------------------|
| `vdk init`   | Starts the interactive setup wizard to configure a project. |
| `vdk deploy` | Deploys rules to the AI assistant (coming soon).            |
| `vdk update` | Updates the CLI and rule templates (coming soon).           |
| `vdk status` | Checks the current VDK configuration status.                |

## Release Process

1.  **Development** → Test locally with `npm link`.
2.  **Testing** → Run a full manual test suite for all commands.
3.  **Documentation** → Update `GUIDE.md` and other docs.
4.  **Versioning** → Increment the version in `package.json`.
5.  **Publishing** → Publish the new version to npm.
6.  **Tagging** → Create a new git tag for the release.

## Post-Publishing

After publishing, users can immediately install or update the CLI:

```bash
# Install globally
npm install -g @vdk/cli

# Or update an existing installation
npm update -g @vdk/cli

# Run the setup wizard in a project
vdk init
```

This approach provides a complete, easy-to-use toolkit in a single package.