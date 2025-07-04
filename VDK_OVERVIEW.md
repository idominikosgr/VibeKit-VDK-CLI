<div align="center">

# 🚀 VibeKit VDK CLI Overview

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/idominikosgr/VibeKit-VDK-CLI?style=social)](https://github.com/idominikosgr/VibeKit-VDK-CLI)
[![Last Updated](https://img.shields.io/badge/Last%20Updated-July%202025-brightgreen)](https://github.com/idominikosgr/VibeKit-VDK-CLI)

**An enhanced framework for generating intelligent, project-aware context for AI coding assistants.**

</div>

## 📋 Overview

The VibeKit VDK CLI is a command-line tool designed to analyze your project's structure, dependencies, and coding patterns to generate a set of tailored rule files. These rules provide your AI assistant with the deep context it needs to offer more accurate, relevant, and helpful suggestions.

### ✨ Key Features

- **🔧 Interactive Setup Wizard**: The `vdk init` command walks you through a simple setup process to configure your project.
- **🧠 Intelligent Project Analysis**: Automatically detects your project's language, framework, and key dependencies.
- **📝 Custom Rule Generation**: Creates a `.vdk/` directory with rule files tailored to your specific project.
- **🤖 Enhanced AI Assistance**: Provides your AI with the context it needs to understand your code at a deeper level.

## 🏗️ Project Structure

After running `vdk init`, the CLI will create a `.vdk` directory in your project root:

```
my-project/
├── .vdk/
│   ├── rules/
│   │   ├── 00-core-rules.md
│   │   └── ... (other generated rule files)
│   └── vdk.config.json
├── src/
└── package.json
```

- **`.vdk/rules/`**: Contains the generated markdown rule files for the AI assistant.
- **`vdk.config.json`**: Stores the configuration and metadata for your project.

## 📚 Documentation

All documentation has been consolidated and updated to reflect the new branding and command structure.

- **[📖 Main Guide](GUIDE.md)**: The primary guide for installation, usage, and commands.
- **[🤝 Contribution Guide](CONTRIBUTING.md)**: Instructions for contributing to the project.
- **[🗺️ Project Roadmap](ROADMAP.md)**: The long-term vision and feature plan.

## 🔮 Future Plans

We have an extensive roadmap of planned enhancements, including:

- **`vdk deploy`**: A command to deploy rules to various AI assistants.
- **`vdk update`**: A command to update the CLI and rule templates.
- **Expanded Template Library**: More rules for more languages and frameworks.

Check out our detailed roadmap here: [**ROADMAP.md**](ROADMAP.md)

---

<div align="center">

© Original DevRules: Seth Rose - [GitHub](https://github.com/TheSethRose)
© VibeKit VDK CLI Enhancements: Dominikos Pritis - [GitHub](https://github.com/idominikosgr)
© 2025 VibeKit VDK CLI

</div>