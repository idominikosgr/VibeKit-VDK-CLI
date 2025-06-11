#!/usr/bin/env node

/**
 * Analytics Schema Extension Script
 *
 * This script applies the analytics schema extension to a Supabase database.
 * Usage: node apply-analytics-schema.js --url=YOUR_SUPABASE_URL --password=YOUR_PASSWORD
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('url', {
    description: 'Supabase database URL',
    type: 'string',
    required: true
  })
  .option('password', {
    description: 'Database password',
    type: 'string',
    required: true
  })
  .option('user', {
    description: 'Database user',
    type: 'string',
    default: 'postgres'
  })
  .option('db', {
    description: 'Database name',
    type: 'string',
    default: 'postgres'
  })
  .help()
  .alias('help', 'h')
  .argv;

// Get path to schema file
const schemaFilePath = path.join(__dirname, '../lib/supabase/schema-analytics-extension.sql');

// Check if schema file exists
if (!fs.existsSync(schemaFilePath)) {
  console.error(chalk.red('❌ Schema file not found:'), schemaFilePath);
  process.exit(1);
}

console.log(chalk.blue('📊 Applying analytics schema extension...'));

// Build psql command
const psqlCommand = `PGPASSWORD="${argv.password}" psql -h ${argv.url} -U ${argv.user} -d ${argv.db} -f "${schemaFilePath}"`;

// Execute the command
exec(psqlCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(chalk.red('❌ Failed to apply schema:'), error.message);
    process.exit(1);
  }

  if (stderr) {
    console.warn(chalk.yellow('⚠️ Warnings:'), stderr);
  }

  console.log(chalk.green('✅ Analytics schema extension applied successfully!'));
  console.log(stdout);

  console.log(chalk.blue('\n📝 Next steps:'));
  console.log('1. Configure your web application to use the new analytics features');
  console.log('2. Implement analytics dashboards and feedback UI components');
  console.log('3. Start collecting valuable insights about rule usage');
});
