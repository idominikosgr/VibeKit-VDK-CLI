// Run the wizard
runSetupWizard().catch(err => {
  console.error(`${colors.red}Error:${colors.reset}`, err);
  rl.close();
});// Function to run the project scanner for automatic configuration
async function runProjectScanner() {
  console.log(`
${colors.bright}${colors.blue}=== Running Project Scanner ===${colors.reset}`);
  console.log(`Analyzing your project structure and code patterns...
`);

  // Show spinner while scanning
  const spinner = ora('Scanning project...').start();

  try {
    // Path to the project scanner tool
    const scannerPath = path.join(__dirname, 'tools', 'project-scanner');

    // Get the current working directory (where the user is running the script from)
    const projectPath = process.cwd();

    // Get the rule output path from the selected IDE
    const ideId = userSelections.ideTool;
    const rulePath = ideConfig.ensureRuleDirectory(ideId, projectPath);

    // Execute the project scanner with the correct path and output to the selected IDE's rules directory
    const { stdout, stderr } = await execPromise(`cd ${scannerPath} && node src/index.js --path ${projectPath} --output ${rulePath} --verbose`);

    spinner.succeed('Project scan completed successfully!');
    console.log(`${colors.green}✓${colors.reset} Generated customized rules based on your project structure`);
    console.log(`${colors.green}✓${colors.reset} Rules installed in ${colors.cyan}${rulePath}${colors.reset}`);

    // If we need to display any detailed output
    if (userSelections.verbose) {
      console.log(`
${colors.dim}Scanner output:${colors.reset}`);
      console.log(stdout);
    }

    return true;
  } catch (error) {
    spinner.fail('Project scan failed');
    console.error(`${colors.red}Error running project scanner:${colors.reset} ${error.message}`);
    console.log(`
${colors.yellow}Falling back to manual configuration...${colors.reset}`);
    return false;
  }
}// Helper function for executing commands with promises
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

// Main function to run the setup wizard
async function runSetupWizard() {
  console.log(`
${colors.bright}${colors.magenta}=== CodePilotRules Setup Wizard ===${colors.reset}
`);
  console.log(`${colors.bright}Welcome to the interactive setup for CodePilotRules!${colors.reset}`);
  console.log(`This wizard will guide you through configuring AI development rules for your project.`);
  console.log(`
You can choose between automatic project scanning or manual configuration:`);
  console.log(` • Automatic: We'll scan your project and detect frameworks, languages, and patterns`);
  console.log(` • Manual: You'll select your frameworks, languages, and technologies`);
  console.log(` • Hybrid: We'll scan your project but let you make adjustments`);
  console.log(`
This will create a customized rule structure optimized for your development environment.`);

  try {
    // First, select whether to use automatic or manual setup
    await selectSetupMode();

    // Always get IDE/Tool selection regardless of mode
    await selectIDETool();

    // Handle setup based on selected mode
    if (userSelections.setupMode === 'automatic') {
      // Run the project scanner for automatic configuration
      const scanSuccess = await runProjectScanner();

      // If scanning fails, fall back to manual configuration
      if (!scanSuccess) {
        await selectFramework();
        await selectLanguage();
        await selectStack();
        await selectTechnologies();
      }
    } else if (userSelections.setupMode === 'manual') {
      // Proceed with manual configuration
      await selectFramework();
      await selectLanguage();
      await selectStack();
      await selectTechnologies();
    } else if (userSelections.setupMode === 'hybrid') {
      // Run automatic scan first, then allow manual adjustments
      await runProjectScanner();

      const { makeAdjustments } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'makeAdjustments',
          message: 'Would you like to make manual adjustments to the detected settings?',
          default: true
        }
      ]);

      if (makeAdjustments) {
        await selectFramework();
        await selectLanguage();
        await selectStack();
        await selectTechnologies();
      }
    }

    // Always select tools regardless of mode
    await selectTools();

    // Confirm selections
    const confirmed = await confirmSelections();
    if (!confirmed) {
      console.log(`\n${colors.yellow}Setup cancelled. Please run the wizard again.${colors.reset}`);
      rl.close();
      return;
    }

    // Copy rule files based on selections
    await copyRuleFiles();

    console.log(`
${colors.bright}${colors.green}Setup Complete!${colors.reset}
Your CodePilotRules have been configured for ${colors.cyan}${userSelections.ideToolName}${colors.reset}.
${colors.bright}To start using them, restart your IDE/AI assistant.${colors.reset}
    `);
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset} ${error.message}`);
  } finally {
    rl.close();
  }
}#!/usr/bin/env node

/**
 * CodePilotRules Setup Wizard
 * -----------------------
 * This interactive script helps configure CodePilotRules for your development project.
 * It creates a custom rule structure based on your selected IDE/tools, frameworks,
 * languages, and technologies.
 *
 * Repository: https://github.com/idominikosgr/CodePilotRules
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer');
const { exec } = require('child_process');
const ora = require('ora');

// Setup colors for CLI
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

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Import the centralized IDE configuration from the shared module
 * This ensures consistency between setup-wizard and project-scanner
 */
const ideConfig = require('./shared/ide-configuration');

/**
 * Import the editor path resolver for managing MCP configuration
 */
const editorPathResolver = require('./shared/editor-path-resolver');

/**
 * Available IDE/Tool options with their corresponding directory structures
 * Each IDE/tool will store rules in a specific directory structure that works best with its integration
 * This is now derived from the centralized configuration
 */
const ideTools = ideConfig.getIDEOptionsForWizard();

/**
 * Available technology frameworks to choose from
 * Each framework will enable specific rule files
 */
const frameworks = [
  { name: 'React', folder: 'React-Modern', description: 'Modern React with hooks and functional components' },
  { name: 'Next.js', folder: 'NextJS-Comprehensive', description: 'Next.js with App Router and React Server Components' },
  { name: 'Vue.js', folder: 'Vue-Modern', description: 'Vue 3 with Composition API' },
  { name: 'Angular', folder: 'Angular-Modern', description: 'Modern Angular with best practices' },
  { name: 'Svelte', folder: 'Svelte', description: 'Svelte with runes and component patterns' },
  { name: 'Express.js', folder: 'Node-Express', description: 'Node.js Express with structured routing' },
  { name: 'NestJS', folder: 'NestJS', description: 'NestJS framework for scalable server-side applications' },
  { name: 'Django', folder: 'Django-Modern', description: 'Django with modern Python features' },
  { name: 'Flask', folder: 'Flask', description: 'Python Flask for lightweight web applications' },
  { name: 'FastAPI', folder: 'FastAPI', description: 'Python FastAPI with type hints' },
  { name: 'Flutter', folder: 'Flutter', description: 'Flutter for cross-platform app development' },
  { name: 'SwiftUI', folder: 'SwiftUI', description: 'Modern SwiftUI with NavigationStack patterns' },
  { name: 'React Native', folder: 'ReactNative-Mobile', description: 'React Native for mobile app development' },
  { name: 'None/Other', folder: 'Generic-Framework', description: 'Skip framework-specific rules' }
];

/**
 * Available programming languages to choose from
 * Each language will enable specific rule files
 */
const languages = [
  { name: 'TypeScript', folder: 'TypeScript-Modern', description: 'Modern TypeScript with functional programming patterns' },
  { name: 'JavaScript', folder: 'JavaScript', description: 'JavaScript with modern ES features' },
  { name: 'Python', folder: 'Python3', description: 'Python 3 with typing and modern patterns' },
  { name: 'Java', folder: 'Java', description: 'Java with modern language features' },
  { name: 'C#', folder: 'CSharp', description: 'C# with .NET Core and modern patterns' },
  { name: 'Go', folder: 'Go', description: 'Go with idiomatic patterns' },
  { name: 'Ruby', folder: 'Ruby', description: 'Ruby with modern language features' },
  { name: 'PHP', folder: 'PHP', description: 'PHP with modern language features' },
  { name: 'Swift', folder: 'Swift', description: 'Swift 5.9/6.0 with macros and concurrency' },
  { name: 'Kotlin', folder: 'Kotlin', description: 'Kotlin for Android and server-side' },
  { name: 'Rust', folder: 'Rust', description: 'Rust with memory safety patterns' },
  { name: 'C++', folder: 'CPP20', description: 'Modern C++ with C++20 features' },
  { name: 'Other', folder: 'Generic-Language', description: 'Skip language-specific rules' }
];

/**
 * Available technology stacks to choose from
 * Each stack represents a combination of technologies that work well together
 */
const stacks = [
  { name: 'NextJS Enterprise Stack', folder: 'NextJS-Enterprise-Stack', description: 'Enterprise-grade Next.js setup' },
  { name: 'Supabase + Next.js', folder: 'Supabase-NextJS-Stack', description: 'Next.js with Supabase backend' },
  { name: 'tRPC Full-Stack', folder: 'TRPC-FullStack', description: 'End-to-end typesafe APIs with tRPC' },
  { name: 'MERN Stack', folder: 'MERN-Stack', description: 'MongoDB, Express, React, Node.js' },
  { name: 'MEAN Stack', folder: 'MEAN-Stack', description: 'MongoDB, Express, Angular, Node.js' },
  { name: 'Laravel + Vue', folder: 'Laravel-Vue-Stack', description: 'Laravel backend with Vue frontend' },
  { name: 'Django REST + React', folder: 'Django-React-Stack', description: 'Django REST Framework with React' },
  { name: 'Spring Boot + React', folder: 'Spring-React-Stack', description: 'Spring Boot backend with React frontend' },
  { name: 'Astro Content Stack', folder: 'Astro-Content-Stack', description: 'Astro with content-focused approach' },
  { name: 'Ecommerce Stack', folder: 'Ecommerce-Stack', description: 'Full e-commerce solution' },
  { name: 'React Native Mobile', folder: 'ReactNative-Mobile-Stack', description: 'React Native with mobile best practices' },
  { name: 'None/Other', folder: 'Generic-Stack', description: 'Skip stack-specific rules' }
];

/**
 * Available additional technologies to choose from
 * Multiple technologies can be selected to enable specific rule files
 */
const technologies = [
  { name: 'Tailwind CSS', folder: 'TailwindCSS', description: 'Utility-first CSS framework' },
  { name: 'Redux', folder: 'Redux-Modern', description: 'Modern Redux with toolkit pattern' },
  { name: 'GraphQL', folder: 'GraphQL', description: 'GraphQL API development' },
  { name: 'Prisma', folder: 'Prisma', description: 'Next-generation ORM for Node.js' },
  { name: 'PostgreSQL', folder: 'PostgreSQL', description: 'PostgreSQL database integration' },
  { name: 'MongoDB', folder: 'MongoDB', description: 'MongoDB database integration' },
  { name: 'Docker', folder: 'Docker', description: 'Docker containerization' },
  { name: 'AWS', folder: 'AWS', description: 'AWS cloud services integration' },
  { name: 'Firebase', folder: 'Firebase', description: 'Firebase backend services' },
  { name: 'shadcn/ui', folder: 'ShadcnUI', description: 'Component library using Tailwind CSS' },
  { name: 'Agentic AI', folder: 'Agentic-AI-Development', description: 'AI agents for development assistance' },
  { name: 'MCP Servers', folder: 'MCP-Integration', description: 'Multi-context processing integration' },
  { name: 'Sequential Thinking', folder: 'Sequential-Thinking-Advanced', description: 'Advanced sequential reasoning patterns' },
  { name: 'Memory Management', folder: 'Memory-Management', description: 'Patterns for memory and state management' }
];

/**
 * AI assistant tools that can be enabled
 * These provide specific capabilities or workflows
 */
const tools = [
  { name: 'AI Code Review', folder: 'AI-Code-Review', description: 'Automated code review with AI' },
  { name: 'AI Pair Programming', folder: 'AI-Pair-Programming', description: 'Collaborative coding assistance' },
  { name: 'Memory Handoff', folder: 'AI-Session-Handoff', description: 'Persistent context between sessions' },
  { name: 'AI Refactoring', folder: 'AI-Refactoring', description: 'Intelligent code refactoring' },
  { name: 'API Development', folder: 'API-Endpoints', description: 'Tools for API design and implementation' },
  { name: 'Performance Optimization', folder: 'Optimize-Performance', description: 'Code optimization guidance' },
  { name: 'Task Breakdown', folder: 'Task-Breakdown', description: 'Decompose complex tasks into steps' },
  { name: 'Write Tests', folder: 'Write-Tests', description: 'Generate test suites for code' }
];

// User selections
const userSelections = {
  projectPath: process.cwd(),
  ideTool: null,
  ideToolName: null,
  framework: null,
  language: null,
  stack: null,
  technologies: [],
  tools: [],
  verbose: false,
  setupMode: 'automatic'
};

// Function to ask a question and get input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Select the IDE or tool to use for AI-assisted development
 * This will determine where rule files are stored and how they're structured
 * Enhanced with automatic IDE detection and prioritization of detected IDEs
 */
async function selectIDETool() {
  console.log(`\n${colors.bright}${colors.cyan}Step 1: Select your IDE or AI Tool${colors.reset}`);
  console.log('This determines where the rules will be stored and how they integrate with your AI assistant.');

  // Detect IDEs in the current project directory
  const detectedIDEs = ideConfig.detectIDEs(process.cwd());

  if (detectedIDEs.length > 0) {
    console.log(`\n${colors.bright}${colors.green}Detected IDE configurations:${colors.reset}`);
    detectedIDEs.forEach((ide) => {
      console.log(`${colors.green}• ${ide.name}${colors.reset} (${ide.configFolder})`);
    });
    console.log('');
  }

  // Use inquirer for a more user-friendly selection interface
  const ideChoices = ideTools.map(tool => {
    const isDetected = detectedIDEs.some(ide => ide.id === tool.id);
    return {
      name: `${tool.name}${isDetected ? ` ${colors.green}(detected)${colors.reset}` : ''} - ${tool.description}`,
      value: tool.id,
      short: tool.name
    };
  });

  // Find the default selection (first detected IDE, or first option if none detected)
  let defaultSelection = 'generic';
  if (detectedIDEs.length > 0) {
    const detectedTool = ideTools.find(tool => tool.id === detectedIDEs[0].id);
    if (detectedTool) {
      defaultSelection = detectedTool.id;
    }
  }

  const { ideTool } = await inquirer.prompt([{
    type: 'list',
    name: 'ideTool',
    message: 'Select the IDE or tool you\'re using:',
    choices: ideChoices,
    default: defaultSelection,
    pageSize: 10
  }]);

  // Store the selection
  userSelections.ideTool = ideTool;
  const selectedIDE = ideConfig.getIDEConfigById(ideTool);
  userSelections.ideToolName = selectedIDE ? selectedIDE.name : 'Unknown IDE';

  console.log(`${colors.green}✓${colors.reset} Selected: ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
  console.log(`  Rules will be installed in ${colors.cyan}${selectedIDE.rulesFolder}${colors.reset}`);

  return Promise.resolve();
}

// Function to select a framework
async function selectFramework() {
  console.log(`\n${colors.bright}${colors.cyan}Step 2: Select your framework:${colors.reset}`);
  console.log('This determines which framework-specific patterns and best practices will be applied.');

  const { framework } = await inquirer.prompt([{
    type: 'list',
    name: 'framework',
    message: 'Select your primary framework:',
    choices: frameworks.map(f => ({
      name: `${f.name} - ${f.description}`,
      value: f
    })),
    pageSize: 10
  }]);

  userSelections.framework = framework;
  console.log(`${colors.green}✓${colors.reset} Selected: ${colors.cyan}${framework.name}${colors.reset}`);

  return Promise.resolve();
}

// Function to select a language
async function selectLanguage() {
  console.log(`\n${colors.bright}${colors.cyan}Step 3: Select your primary language:${colors.reset}`);
  console.log('This determines which language-specific patterns and best practices will be applied.');

  const { language } = await inquirer.prompt([{
    type: 'list',
    name: 'language',
    message: 'Select your primary programming language:',
    choices: languages.map(l => ({
      name: `${l.name} - ${l.description}`,
      value: l
    })),
    pageSize: 10
  }]);

  userSelections.language = language;
  console.log(`${colors.green}✓${colors.reset} Selected: ${colors.cyan}${language.name}${colors.reset}`);

  return Promise.resolve();
}

// Function to select a stack
async function selectStack() {
  console.log(`\n${colors.bright}${colors.cyan}Step 4: Select your project stack (optional):${colors.reset}`);
  console.log('This determines which pre-configured stack templates will be applied.');

  const { stack } = await inquirer.prompt([{
    type: 'list',
    name: 'stack',
    message: 'Select your project stack:',
    choices: [
      ...stacks.map(s => ({
        name: `${s.name} - ${s.description}`,
        value: s
      })),
      { name: 'Skip this step', value: null }
    ],
    pageSize: 10
  }]);

  userSelections.stack = stack;
  if (stack) {
    console.log(`${colors.green}✓${colors.reset} Selected: ${colors.cyan}${stack.name}${colors.reset}`);
  } else {
    console.log(`${colors.yellow}→${colors.reset} Skipped stack selection.`);
  }

  return Promise.resolve();
}

// Function to select technologies
async function selectTechnologies() {
  console.log(`\n${colors.bright}${colors.cyan}Step 5: Select additional technologies:${colors.reset}`);
  console.log('Multiple selections allowed. These determine which technology-specific patterns will be applied.');

  const { selectedTechs } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selectedTechs',
    message: 'Select additional technologies (use space to select, enter to confirm):',
    choices: technologies.map(t => ({
      name: `${t.name} - ${t.description}`,
      value: t
    })),
    pageSize: 10
  }]);

  userSelections.technologies = selectedTechs || [];

  if (selectedTechs && selectedTechs.length > 0) {
    console.log(`${colors.green}✓${colors.reset} Selected ${selectedTechs.length} technologies:`);
    selectedTechs.forEach(tech => {
      console.log(`  • ${colors.cyan}${tech.name}${colors.reset}`);
    });
  } else {
    console.log(`${colors.yellow}→${colors.reset} No additional technologies selected.`);
  }

  return Promise.resolve();
}

// Function to select tools/tasks
async function selectTools() {
  console.log(`\n${colors.bright}${colors.cyan}Step 6: Select AI assistant tools:${colors.reset}`);
  console.log('Multiple selections allowed. These determine which AI assistant capabilities will be enabled.');

  const { selectedTools } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selectedTools',
    message: 'Select AI assistant tools (use space to select, enter to confirm):',
    choices: tools.map(t => ({
      name: `${t.name} - ${t.description}`,
      value: t
    })),
    pageSize: 10
  }]);

  userSelections.tools = selectedTools || [];

  if (selectedTools && selectedTools.length > 0) {
    console.log(`${colors.green}✓${colors.reset} Selected ${selectedTools.length} tools:`);
    selectedTools.forEach(tool => {
      console.log(`  • ${colors.cyan}${tool.name}${colors.reset}`);
    });
  } else {
    console.log(`${colors.yellow}→${colors.reset} No AI assistant tools selected.`);
  }

  return Promise.resolve();
}

// Function to confirm the selections
async function confirmSelections() {
  console.log(`\n${colors.bright}${colors.magenta}Review your selections:${colors.reset}`);
  console.log(`IDE/Tool: ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
  console.log(`Framework: ${colors.cyan}${userSelections.framework ? userSelections.framework.name : 'None'}${colors.reset}`);
  console.log(`Language: ${colors.cyan}${userSelections.language ? userSelections.language.name : 'None'}${colors.reset}`);
  console.log(`Stack: ${colors.cyan}${userSelections.stack ? userSelections.stack.name : 'None'}${colors.reset}`);

  console.log(`\nTechnologies:`);
  if (userSelections.technologies.length === 0) {
    console.log(`  ${colors.yellow}None${colors.reset}`);
  } else {
    userSelections.technologies.forEach(tech => {
      console.log(`  • ${colors.cyan}${tech.name}${colors.reset}`);
    });
  }

  console.log(`\nAI Assistant Tools:`);
  if (userSelections.tools.length === 0) {
    console.log(`  ${colors.yellow}None${colors.reset}`);
  } else {
    userSelections.tools.forEach(tool => {
      console.log(`  • ${colors.cyan}${tool.name}${colors.reset}`);
    });
  }

  const { confirmed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmed',
    message: 'Is this configuration correct?',
    default: true
  }]);

  return confirmed;
}

/**
 * Copy rule files based on selected IDE and technology choices
 * Enhanced to handle assistant-specific rule files and improved error handling
 */
async function copyRuleFiles() {
  console.log(`\n${colors.bright}${colors.blue}Setting up rules for ${colors.cyan}${userSelections.ideToolName}${colors.blue}...${colors.reset}`);

  try {
    // Get the target directory path based on the selected IDE
    const ideTool = userSelections.ideTool;
    const targetDir = ideConfig.ensureRuleDirectory(ideTool, userSelections.projectPath);
    console.log(`${colors.green}✓${colors.reset} Created rule directory: ${colors.cyan}${targetDir}${colors.reset}`);

    // First, try using the project scanner for automatic setup if that mode was selected
    if (userSelections.setupMode === 'automatic' || userSelections.setupMode === 'hybrid') {
      try {
        const scannerSuccess = await createRuleFilesFromScanner(targetDir);
        if (scannerSuccess && userSelections.setupMode === 'automatic') {
          return true;
        }
      } catch (error) {
        console.log(`${colors.yellow}→${colors.reset} Project scanner unavailable or failed. Using template-based setup.`);
      }
    }

    // Fall back to template-based rule generation
    await createRuleFilesFromTemplates(targetDir);

    // Create directories if they don't exist
    const directories = [
      path.join(targetDir, 'languages'),
      path.join(targetDir, 'technologies'),
      path.join(targetDir, 'stacks'),
      path.join(targetDir, 'tasks'),
      path.join(targetDir, 'assistants'),
      path.join(targetDir, 'tools'),
      path.join(targetDir, 'ai-tools')
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Copy selected rule files
    await copyLanguageRules(targetDir);
    await copyFrameworkRules(targetDir);
    await copyStackRules(targetDir);
    await copyTechnologyRules(targetDir);
    await copyToolRules(targetDir);

    // Update MCP configuration
    await updateMCPConfiguration(targetDir);

    console.log(`\n${colors.green}✓${colors.reset} Setup complete! Rules have been installed for ${colors.cyan}${userSelections.ideToolName}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error during rule file setup:${colors.reset} ${error.message}`);
    return false;
  }
}

// Helper function to copy language rules
async function copyLanguageRules(targetDir) {
  if (!userSelections.language || !userSelections.language.folder) {
    return;
  }

  const templateDir = path.join(__dirname, 'templates', 'languages');
  const langSource = path.join(templateDir, `${userSelections.language.folder}.mdc`);
  const langTarget = path.join(targetDir, 'languages', `${userSelections.language.folder}.mdc`);

  if (fs.existsSync(langSource)) {
    fs.copyFileSync(langSource, langTarget);
    console.log(`${colors.green}✓${colors.reset} Copied ${userSelections.language.name} language rules`);
  } else {
    console.log(`${colors.yellow}→${colors.reset} No template found for ${userSelections.language.name}`);
  }
}

// Helper function to copy framework rules
async function copyFrameworkRules(targetDir) {
  if (!userSelections.framework || !userSelections.framework.folder) {
    return;
  }

  const templateDir = path.join(__dirname, 'templates', 'technologies');
  const frameworkSource = path.join(templateDir, `${userSelections.framework.folder}.mdc`);
  const frameworkTarget = path.join(targetDir, 'technologies', `${userSelections.framework.folder}.mdc`);

  if (fs.existsSync(frameworkSource)) {
    fs.copyFileSync(frameworkSource, frameworkTarget);
    console.log(`${colors.green}✓${colors.reset} Copied ${userSelections.framework.name} framework rules`);
  } else {
    console.log(`${colors.yellow}→${colors.reset} No template found for ${userSelections.framework.name}`);
  }
}

// Helper function to copy stack rules
async function copyStackRules(targetDir) {
  if (!userSelections.stack || !userSelections.stack.folder) {
    return;
  }

  const templateDir = path.join(__dirname, 'templates', 'stacks');
  const stackSource = path.join(templateDir, `${userSelections.stack.folder}.mdc`);
  const stackTarget = path.join(targetDir, 'stacks', `${userSelections.stack.folder}.mdc`);

  if (fs.existsSync(stackSource)) {
    fs.copyFileSync(stackSource, stackTarget);
    console.log(`${colors.green}✓${colors.reset} Copied ${userSelections.stack.name} stack rules`);
  } else {
    console.log(`${colors.yellow}→${colors.reset} No template found for ${userSelections.stack.name}`);
  }
}

// Helper function to copy technology rules
async function copyTechnologyRules(targetDir) {
  if (!userSelections.technologies || userSelections.technologies.length === 0) {
    return;
  }

  const templateDir = path.join(__dirname, 'templates', 'technologies');

  for (const tech of userSelections.technologies) {
    if (tech.folder) {
      const techSource = path.join(templateDir, `${tech.folder}.mdc`);
      const techTarget = path.join(targetDir, 'technologies', `${tech.folder}.mdc`);

      if (fs.existsSync(techSource)) {
        fs.copyFileSync(techSource, techTarget);
        console.log(`${colors.green}✓${colors.reset} Copied ${tech.name} technology rules`);
      } else {
        console.log(`${colors.yellow}→${colors.reset} No template found for ${tech.name}`);
      }
    }
  }
}

// Helper function to copy tool rules
async function copyToolRules(targetDir) {
  if (!userSelections.tools || userSelections.tools.length === 0) {
    return;
  }

  const templateDir = path.join(__dirname, 'templates', 'tools');

  for (const tool of userSelections.tools) {
    if (tool.folder) {
      const toolSource = path.join(templateDir, `${tool.folder}.mdc`);
      const toolTarget = path.join(targetDir, 'tools', `${tool.folder}.mdc`);

      if (fs.existsSync(toolSource)) {
        fs.copyFileSync(toolSource, toolTarget);
        console.log(`${colors.green}✓${colors.reset} Copied ${tool.name} tool rules`);
      } else {
        console.log(`${colors.yellow}→${colors.reset} No template found for ${tool.name}`);
      }
    }
  }
}

// Create rule files using the project scanner
async function createRuleFilesFromScanner(targetDir) {
  console.log(`${colors.blue}Running Project Scanner to analyze your codebase...${colors.reset}`);

  const spinner = ora('Scanning project...').start();

  // The scanner target directory should be the .ai/rules folder or equivalent
  const projectPath = userSelections.projectPath;
  const scannerPath = path.join(__dirname, 'tools', 'project-scanner');

  try {
    // Execute the scanner with proper arguments
    const outputPath = targetDir;
    const { stdout } = await execPromise(
      `cd ${scannerPath} && node src/index.js --path ${projectPath} --output ${outputPath} ${userSelections.verbose ? '--verbose' : ''}`
    );

    spinner.succeed('Project scan completed successfully!');
    console.log(`${colors.green}✓${colors.reset} Successfully generated rule files using Project Scanner`);

    if (userSelections.verbose) {
      console.log(`\n${colors.dim}Scanner output:${colors.reset}`);
      console.log(stdout);
    }

    return true;
  } catch (error) {
    spinner.fail('Project scan failed');
    console.error(`${colors.red}Error running Project Scanner:${colors.reset} ${error.message}`);
    console.log(`${colors.yellow}Falling back to template-based rule generation${colors.reset}`);
    return false;
  }
}

// Create rule files from templates
async function createRuleFilesFromTemplates(targetDir) {
  console.log(`${colors.blue}Creating base rule files from templates...${colors.reset}`);

  const projectName = path.basename(path.resolve(userSelections.projectPath));
  const templateDir = path.join(__dirname, 'templates', 'rules');

  // Core rule files
  const coreFiles = [
    '00-core-agent.mdc',
    '01-project-context.mdc',
    '02-common-errors.mdc',
    '03-mcp-configuration.mdc'
  ];

  // Process each template file
  for (const file of coreFiles) {
    const templatePath = path.join(templateDir, file);
    const targetPath = path.join(targetDir, file);

    if (fs.existsSync(templatePath) && !fs.existsSync(targetPath)) {
      let content = fs.readFileSync(templatePath, 'utf8');

      // Replace variables
      content = content.replace(/\{\{projectName\}\}/g, projectName);
      content = content.replace(/\{\{projectFramework\}\}/g, userSelections.framework?.name || 'Not specified');
      content = content.replace(/\{\{projectLanguage\}\}/g, userSelections.language?.name || 'Not specified');

      // Additional replacements
      const techList = userSelections.technologies?.map(t => t.name).join(', ') || 'None';
      content = content.replace(/\{\{additionalTechnologies\}\}/g, techList);

      // Add a generic project purpose if not available
      content = content.replace(/\{\{projectPurpose\}\}/g, 'application');

      // Update timestamp
      const today = new Date().toISOString().split('T')[0];
      content = content.replace(/\{\{date\}\}/g, today);

      fs.writeFileSync(targetPath, content, 'utf8');
      console.log(`${colors.green}✓${colors.reset} Created ${file}`);
    } else if (fs.existsSync(targetPath)) {
      console.log(`${colors.yellow}→${colors.reset} File ${file} already exists, skipping`);
    } else {
      console.log(`${colors.yellow}→${colors.reset} Template ${file} not found, skipping`);
    }
  }

  console.log(`${colors.green}✓${colors.reset} Created rule files from templates`);
  return true;
}

// Function to prompt for setup mode selection
async function selectSetupMode() {
  console.log(`\n${colors.bright}${colors.magenta}Setup Configuration${colors.reset}`);

  const { setupMode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'setupMode',
      message: 'How would you like to configure CodePilotRules?',
      choices: [
        { name: '🔍 Automatic (Scan project and generate rules)', value: 'automatic' },
        { name: '🔧 Manual (Select options individually)', value: 'manual' },
        { name: '🔄 Hybrid (Auto-scan with manual adjustments)', value: 'hybrid' }
      ],
      default: 'automatic'
    }
  ]);

  userSelections.setupMode = setupMode;

  const { verbose } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'verbose',
      message: 'Enable verbose output for detailed information?',
      default: false,
      when: () => setupMode !== 'manual'
    }
  ]);

  userSelections.verbose = verbose || false;

  console.log(`${colors.green}✓${colors.reset} Selected ${colors.cyan}${setupMode}${colors.reset} setup mode${userSelections.verbose ? ' with verbose output' : ''}`);
}

/**
 * Updates the MCP configuration file with editor-specific paths and configurations
 * This function uses the editor-path-resolver to detect configurations and
 * update the 03-mcp-configuration.mdc file with accurate paths
 *
 * @param {string} targetDir - Path to the rules directory
 * @returns {boolean} - Success status
 */
async function updateMCPConfiguration(targetDir) {
  console.log(`${colors.blue}Updating MCP configuration with editor paths...${colors.reset}`);

  // Check if the MCP configuration file exists
  const mcpFilePath = path.join(targetDir, '03-mcp-configuration.mdc');
  if (!fs.existsSync(mcpFilePath)) {
    console.log(`${colors.yellow}→${colors.reset} MCP configuration file not found. Creating from template...`);

    // Copy from template if available
    const templatePath = path.join(__dirname, 'templates', 'rules', '03-mcp-configuration.mdc');
    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, mcpFilePath);
    } else {
      // Create minimal MCP configuration file
      console.log(`${colors.yellow}→${colors.reset} Template not found. Creating minimal MCP configuration.`);
      fs.writeFileSync(mcpFilePath, `---
description: Defines the available Model Context Protocol (MCP) servers and their capabilities.
globs:
alwaysApply: false
version: "2.1.0"
lastUpdated: "${new Date().toISOString().split('T')[0]}"
compatibleWith: ["Memory-MCP", "Sequential-Thinking-Advanced", "MCP-Integration"]
---
# MCP Server Configuration

This file documents the Model Context Protocol (MCP) servers available in your environment.

`, 'utf8');
    }
  }

  // Update the MCP configuration with editor paths
  try {
    const success = editorPathResolver.updateMCPConfigurationFile(userSelections.projectPath, targetDir);
    if (success) {
      console.log(`${colors.green}✓${colors.reset} Successfully updated MCP configuration with editor paths`);
    } else {
      console.log(`${colors.yellow}→${colors.reset} Failed to update MCP configuration. Manual update may be required.`);
    }
    return true;
  } catch (error) {
    console.log(`${colors.yellow}→${colors.reset} Error updating MCP configuration: ${error.message}`);
    return false;
  }
}