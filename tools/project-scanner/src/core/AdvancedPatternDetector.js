/**
 * AdvancedPatternDetector.js
 *
 * Provides enhanced pattern detection capabilities beyond the basic PatternDetector.
 * Specializes in detecting complex architectural patterns, design patterns, and
 * code organization schemes across multiple files and languages.
 */

import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

// Import all language analyzers
import { analyzeJavaScript } from '../analyzers/javascript.js';
import { analyzeTypeScript } from '../analyzers/typescript.js';
import { analyzePython } from '../analyzers/python.js';
import { analyzeSwift } from '../analyzers/swift.js';
import { analyzeRuby } from '../analyzers/ruby.js';
import { analyzeGo } from '../analyzers/go.js';
import { analyzeJava } from '../analyzers/java.js';

export class AdvancedPatternDetector {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.maxFiles = options.maxFiles || 200;
    this.confidenceThreshold = options.confidenceThreshold || 0.7;
    
    // Initialize pattern storage
    this.detectedPatterns = {
      architectural: [],
      design: [],
      dataManagement: [],
      uiPatterns: [],
      testingPatterns: [],
      securityPatterns: []
    };
    
    // Configure language analyzers
    this.languageAnalyzers = {
      '.js': analyzeJavaScript,
      '.jsx': analyzeJavaScript,
      '.ts': analyzeTypeScript,
      '.tsx': analyzeTypeScript,
      '.py': analyzePython,
      '.swift': analyzeSwift,
      '.rb': analyzeRuby,
      '.go': analyzeGo,
      '.java': analyzeJava
    };
  }

  /**
   * Analyze the project to detect advanced patterns
   * @param {Object} projectStructure - The project structure from ProjectScanner
   * @param {Object} basicPatterns - Basic patterns already detected
   * @returns {Object} Advanced pattern detection results
   */
  async detectPatterns(projectStructure, basicPatterns = {}) {
    if (this.verbose) {
      console.log(chalk.blue('Starting advanced pattern detection...'));
    }
    
    // Reset pattern storage
    this.resetPatternStorage();
    
    try {
      // Step 1: Analyze architectural patterns
      await this.detectArchitecturalPatterns(projectStructure);
      
      // Step 2: Detect design patterns
      await this.detectDesignPatterns(projectStructure);
      
      // Step 3: Detect data management patterns
      await this.detectDataManagementPatterns(projectStructure);
      
      // Step 4: Detect UI patterns
      await this.detectUIPatterns(projectStructure);
      
      // Step 5: Detect testing patterns
      await this.detectTestingPatterns(projectStructure);
      
      // Step 6: Detect security patterns
      await this.detectSecurityPatterns(projectStructure);
      
      if (this.verbose) {
        console.log(chalk.green('Advanced pattern detection complete.'));
      }
      
      // Return combined results
      return {
        ...basicPatterns,
        advancedPatterns: this.detectedPatterns
      };
    } catch (error) {
      console.error(chalk.red(`Error in advanced pattern detection: ${error.message}`));
      throw error;
    }
  }
  
  /**
   * Reset pattern storage for a clean analysis
   */
  resetPatternStorage() {
    this.detectedPatterns = {
      architectural: [],
      design: [],
      dataManagement: [],
      uiPatterns: [],
      testingPatterns: [],
      securityPatterns: []
    };
  }
}
