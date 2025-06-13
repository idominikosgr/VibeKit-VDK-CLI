/**
 * ruby.js
 * 
 * Analyzer for Ruby code to detect naming conventions, patterns,
 * and other Ruby-specific elements.
 */

import fs from 'fs/promises';

/**
 * Analyzes Ruby code to detect naming conventions and patterns
 * 
 * @param {string} filePath - Path to the Ruby file
 * @returns {Object} Analysis results containing detected patterns and conventions
 */
export async function analyzeRuby(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    
    const result = {
      variables: [],
      functions: [],
      classes: [],
      modules: [],
      patterns: []
    };
    
    // Class detection (including modules)
    const classRegex = /^(?:\s*)class\s+([A-Za-z0-9_:]+)/;
    const moduleRegex = /^(?:\s*)module\s+([A-Za-z0-9_:]+)/;
    
    // Method detection
    const methodRegex = /^(?:\s*)def\s+(?:self\.)?([a-zA-Z0-9_?!]+)/;
    
    // Variable detection (including instance, class, and global variables)
    const instanceVarRegex = /(@[a-z_][a-zA-Z0-9_]*)/g;
    const classVarRegex = /(@@[a-z_][a-zA-Z0-9_]*)/g;
    const globalVarRegex = /(\$[a-zA-Z0-9_]+)/g;
    const constantRegex = /([A-Z][A-Z0-9_]*)\s*=/;
    
    // Pattern detection
    const railsPatterns = {
      activeRecord: /ActiveRecord::Base|ApplicationRecord/,
      activeController: /ActionController::Base|ApplicationController/,
      activeMailer: /ActionMailer::Base|ApplicationMailer/,
      activeJob: /ActiveJob::Base|ApplicationJob/,
      rspec: /describe|context|it|expect/,
      rubocop: /# rubocop:/,
      gemfile: /gem ['"]([^'"]+)['"]/g
    };

    // Analyze each line
    lines.forEach((line, i) => {
      // Skip comments
      if (line.trim().startsWith('#')) return;
      
      // Detect classes
      const classMatch = line.match(classRegex);
      if (classMatch) {
        result.classes.push(classMatch[1]);
      }
      
      // Detect modules
      const moduleMatch = line.match(moduleRegex);
      if (moduleMatch) {
        result.modules.push(moduleMatch[1]);
      }
      
      // Detect methods
      const methodMatch = line.match(methodRegex);
      if (methodMatch) {
        result.functions.push(methodMatch[1]);
      }
      
      // Detect instance variables
      const instanceVars = [...line.matchAll(instanceVarRegex)];
      instanceVars.forEach(match => {
        if (!result.variables.includes(match[1])) {
          result.variables.push(match[1]);
        }
      });
      
      // Detect class variables
      const classVars = [...line.matchAll(classVarRegex)];
      classVars.forEach(match => {
        if (!result.variables.includes(match[1])) {
          result.variables.push(match[1]);
        }
      });
      
      // Detect global variables
      const globalVars = [...line.matchAll(globalVarRegex)];
      globalVars.forEach(match => {
        if (!result.variables.includes(match[1])) {
          result.variables.push(match[1]);
        }
      });
      
      // Detect constants
      const constantMatch = line.match(constantRegex);
      if (constantMatch && !result.variables.includes(constantMatch[1])) {
        result.variables.push(constantMatch[1]);
      }
      
      // Detect Ruby on Rails patterns
      if (railsPatterns.activeRecord.test(line) && !result.patterns.includes('Rails ActiveRecord')) {
        result.patterns.push('Rails ActiveRecord');
      }
      
      if (railsPatterns.activeController.test(line) && !result.patterns.includes('Rails Controller')) {
        result.patterns.push('Rails Controller');
      }
      
      if (railsPatterns.activeMailer.test(line) && !result.patterns.includes('Rails Mailer')) {
        result.patterns.push('Rails Mailer');
      }
      
      if (railsPatterns.activeJob.test(line) && !result.patterns.includes('Rails Job')) {
        result.patterns.push('Rails Job');
      }
      
      if (railsPatterns.rspec.test(line) && !result.patterns.includes('RSpec Testing')) {
        result.patterns.push('RSpec Testing');
      }
      
      if (railsPatterns.rubocop.test(line) && !result.patterns.includes('Rubocop')) {
        result.patterns.push('Rubocop');
      }
    });

    // Analyze content as a whole for patterns
    const fullContent = content.toString();
    
    // Detect naming conventions
    const namingConventions = detectRubyNamingConventions(result);
    
    return {
      ...result,
      ...namingConventions
    };
  } catch (error) {
    throw new Error(`Ruby analysis failed: ${error.message}`);
  }
}

/**
 * Analyzes naming conventions used in Ruby code
 * 
 * @param {Object} analysis - Analysis data with variables, functions, classes
 * @returns {Object} Naming convention analysis
 */
function detectRubyNamingConventions(analysis) {
  const conventions = {
    variableConvention: detectNamingConvention(analysis.variables),
    functionConvention: detectNamingConvention(analysis.functions),
    classConvention: detectNamingConvention(analysis.classes),
    moduleConvention: detectNamingConvention(analysis.modules)
  };
  
  return conventions;
}

/**
 * Analyzes a collection of names to determine the naming convention
 * 
 * @param {Array} names - Collection of names to analyze
 * @returns {string} Detected naming convention
 */
function detectNamingConvention(names) {
  if (!names || names.length === 0) {
    return 'unknown';
  }
  
  // Count for each convention
  let snakeCase = 0;
  let camelCase = 0;
  let pascalCase = 0;
  let screaming = 0;
  
  // Regex patterns for naming conventions
  const snakeCaseRegex = /^[a-z][a-z0-9_]*$/;
  const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
  const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
  const screamingRegex = /^[A-Z][A-Z0-9_]*$/;
  
  names.forEach(name => {
    // Clean the name (remove prefixes like @ for instance variables)
    const cleanName = name.replace(/^[@$]+/, '');
    
    if (snakeCaseRegex.test(cleanName)) snakeCase++;
    if (camelCaseRegex.test(cleanName)) camelCase++;
    if (pascalCaseRegex.test(cleanName)) pascalCase++;
    if (screamingRegex.test(cleanName)) screaming++;
  });
  
  // Find the most common convention
  const max = Math.max(snakeCase, camelCase, pascalCase, screaming);
  
  if (max === 0) return 'mixed';
  if (max === snakeCase) return 'snake_case';
  if (max === camelCase) return 'camelCase';
  if (max === pascalCase) return 'PascalCase';
  if (max === screaming) return 'SCREAMING_SNAKE_CASE';
  
  return 'mixed';
}
