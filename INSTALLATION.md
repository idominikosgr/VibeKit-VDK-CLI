# CodePilotRules Installation Guide

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/idominikosgr/CodePilotRules.git
   cd CodePilotRules
   ```

2. **Install main dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the setup wizard**:
   ```bash
   npm run wizard
   # or
   node setup-wizard.js
   ```

The setup wizard will automatically install project scanner dependencies when needed.

## Manual Setup (Alternative)

If you prefer to install everything manually:

1. **Install main dependencies**:
   ```bash
   npm install
   ```

2. **Install project scanner dependencies**:
   ```bash
   npm run setup
   # or manually:
   cd tools/project-scanner && npm install
   ```

3. **Run the setup wizard**:
   ```bash
   npm run wizard
   ```

## Available Commands

- `npm run wizard` - Run the interactive setup wizard
- `npm run scan` - Run the project scanner directly
- `npm run setup` - Install project scanner dependencies
- `npm run validate-rules` - Validate existing rule files

## Troubleshooting

### "Module not found" errors
If you see module not found errors, make sure to install dependencies:
```bash
npm install
npm run setup
```

### Project scanner fails
The setup wizard will automatically try to install scanner dependencies. If it fails, run:
```bash
cd tools/project-scanner
npm install
```

### Permission errors
On some systems, you might need to use `sudo` or run as administrator. 