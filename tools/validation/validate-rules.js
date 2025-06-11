#!/usr/bin/env node

/**
 * Rule Validator Tool
 *
 * This script validates all MDC files in the repository against the schema
 * and performs additional checks for consistency and quality.
 */

const fs = require('fs').promises;
const path = require('path');
const glob = require('fast-glob');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const chalk = require('chalk');
const matter = require('gray-matter');

// Load the schema
const schema = require('./mdc-schema.json');

// Initialize the validator
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

// Rule repository paths
const rulesRootDir = path.join(__dirname, '../..');
const ruleDirectories = [
  '',  // Root directory
  'assistants',
  'languages',
  'stacks',
  'tasks',
  'technologies',
  'tools',
  'templates/rules'
];

// Track all rule IDs to check for duplicates
const ruleIds = new Map();

// Main validation function
async function validateRules() {
  let errors = 0;
  let warnings = 0;
  let validFiles = 0;

  console.log(chalk.blue.bold('🔎 Validating MDC rule files...\n'));

  // Process each directory
  for (const dir of ruleDirectories) {
    const dirPath = path.join(rulesRootDir, dir);
    let dirExists = false;

    try {
      await fs.access(dirPath);
      dirExists = true;
    } catch (err) {
      console.log(chalk.yellow(`Directory ${dir || 'root'} does not exist. Skipping.`));
      continue;
    }

    // Find all MDC files in the directory
    const mdcFiles = await glob(['*.mdc', '*.md'], {
      cwd: dirPath,
      ignore: ['README.md', 'CONTRIBUTING.md']  // Ignore non-rule files
    });

    if (mdcFiles.length === 0) {
      console.log(chalk.yellow(`No MDC files found in ${dir || 'root'} directory.`));
      continue;
    }

    console.log(chalk.cyan.bold(`\nChecking ${mdcFiles.length} files in ${dir || 'root'} directory:`));

    // Validate each MDC file
    for (const file of mdcFiles) {
      const filePath = path.join(dirPath, file);
      const relativePath = path.relative(rulesRootDir, filePath);

      try {
        // Read file content
        const content = await fs.readFile(filePath, 'utf-8');

        // Extract front matter
        let frontMatter;
        try {
          frontMatter = matter(content).data;
        } catch (err) {
          console.log(
            chalk.red(`  ✘ ${relativePath}:`),
            chalk.red(`Invalid front matter: ${err.message}`)
          );
          errors++;
          continue;
        }

        // Validate against schema
        const valid = validate(frontMatter);

        if (!valid) {
          console.log(chalk.red(`  ✘ ${relativePath}:`));
          validate.errors.forEach(error => {
            console.log(chalk.red(`    - ${error.instancePath} ${error.message}`));
          });
          errors++;
        } else {
          // Additional checks
          const additionalErrors = performAdditionalChecks(frontMatter, relativePath, file);
          if (additionalErrors > 0) {
            warnings += additionalErrors;
          } else {
            console.log(chalk.green(`  ✓ ${relativePath}`));
            validFiles++;
          }

          // Track rule ID (filename) for duplicate checking
          const ruleId = path.basename(file, path.extname(file));
          if (ruleIds.has(ruleId)) {
            console.log(
              chalk.red(`  ✘ Duplicate rule ID: ${ruleId}`),
              chalk.red(`also exists at ${ruleIds.get(ruleId)}`)
            );
            errors++;
          } else {
            ruleIds.set(ruleId, relativePath);
          }
        }
      } catch (err) {
        console.log(chalk.red(`  ✘ ${relativePath}: Error reading file: ${err.message}`));
        errors++;
      }
    }
  }

  // Summary
  console.log(chalk.blue.bold('\nValidation Summary:'));
  console.log(chalk.green(`  Valid files: ${validFiles}`));
  console.log(chalk.yellow(`  Warnings: ${warnings}`));
  console.log(chalk.red(`  Errors: ${errors}`));

  if (errors > 0) {
    console.log(chalk.red.bold('\n❌ Validation failed. Please fix the errors above.'));
    process.exit(1);
  } else if (warnings > 0) {
    console.log(chalk.yellow.bold('\n⚠️ Validation passed with warnings. Consider addressing them.'));
    process.exit(0);
  } else {
    console.log(chalk.green.bold('\n✅ All rules are valid!'));
    process.exit(0);
  }
}

// Additional quality checks
function performAdditionalChecks(frontMatter, filePath, fileName) {
  let issues = 0;

  // Check for recommended fields
  const recommendedFields = ['author', 'lastUpdated', 'tags'];
  for (const field of recommendedFields) {
    if (!frontMatter[field]) {
      console.log(
        chalk.yellow(`  ⚠ ${filePath}:`),
        chalk.yellow(`Missing recommended field: ${field}`)
      );
      issues++;
    }
  }

  // Check for globs or compatibleWith if not present
  if (!frontMatter.globs && !frontMatter.compatibleWith) {
    console.log(
      chalk.yellow(`  ⚠ ${filePath}:`),
      chalk.yellow('Missing both globs and compatibleWith. At least one is recommended.')
    );
    issues++;
  }

  // Check that title is not the same as the filename (redundant)
  const fileBaseName = path.basename(fileName, path.extname(fileName));
  const normalizedFileName = fileBaseName.replace(/-/g, ' ').toLowerCase();
  const normalizedTitle = frontMatter.title.toLowerCase();

  if (normalizedTitle === normalizedFileName) {
    console.log(
      chalk.yellow(`  ⚠ ${filePath}:`),
      chalk.yellow('Title is the same as the filename. Consider a more descriptive title.')
    );
    issues++;
  }

  // Version format check (beyond schema validation)
  if (frontMatter.version && !frontMatter.version.match(/^\d+\.\d+\.\d+$/)) {
    console.log(
      chalk.yellow(`  ⚠ ${filePath}:`),
      chalk.yellow(`Version ${frontMatter.version} doesn't follow semantic versioning (X.Y.Z)`)
    );
    issues++;
  }

  return issues;
}

// Run validation
validateRules().catch(err => {
  console.error(chalk.red(`An error occurred: ${err.message}`));
  process.exit(1);
});
