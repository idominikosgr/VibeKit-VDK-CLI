/**
 * go.js
 * 
 * Analyzer for Go code to detect naming conventions, patterns,
 * and other Go-specific elements.
 */

import fs from 'fs/promises';

/**
 * Analyzes Go code to detect naming conventions and patterns
 * 
 * @param {string} filePath - Path to the Go file
 * @returns {Object} Analysis results containing detected patterns and conventions
 */
export async function analyzeGo(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    
    const result = {
      variables: [],
      functions: [],
      structs: [],
      interfaces: [],
      packages: new Set(),
      patterns: []
    };
    
    // Package detection
    const packageRegex = /^package\s+([a-zA-Z0-9_]+)/;
    
    // Import detection
    const importRegex = /^import\s+(?:\([\s\S]*?\)|["']([^"']+)["'])/;
    const singleImportRegex = /["']([^"']+)["']/g;
    
    // Function detection
    const funcRegex = /^func\s+(?:\([^)]+\)\s+)?([A-Za-z0-9_]+)\s*\(/;
    
    // Struct detection
    const structRegex = /^type\s+([A-Za-z0-9_]+)\s+struct\s+\{/;
    
    // Interface detection
    const interfaceRegex = /^type\s+([A-Za-z0-9_]+)\s+interface\s+\{/;
    
    // Variable detection
    const varRegex = /(?:^|\s)(var|const)\s+([A-Za-z0-9_]+)\s+/;
    const shortVarRegex = /^\s*([a-zA-Z0-9_]+)\s*:=/;
    
    // Common Go patterns
    let isTestFile = filePath.endsWith('_test.go');
    let hasGoroutines = false;
    let hasChannels = false;
    let hasContexts = false;
    let hasDeferStatements = false;
    
    // Analyze the lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip comments
      if (line.startsWith('//') || line.startsWith('/*')) continue;
      
      // Detect package
      const packageMatch = line.match(packageRegex);
      if (packageMatch) {
        result.packages.add(packageMatch[1]);
      }
      
      // Detect functions
      const funcMatch = line.match(funcRegex);
      if (funcMatch) {
        result.functions.push(funcMatch[1]);
      }
      
      // Detect structs
      const structMatch = line.match(structRegex);
      if (structMatch) {
        result.structs.push(structMatch[1]);
      }
      
      // Detect interfaces
      const interfaceMatch = line.match(interfaceRegex);
      if (interfaceMatch) {
        result.interfaces.push(interfaceMatch[1]);
      }
      
      // Detect variables
      const varMatch = line.match(varRegex);
      if (varMatch) {
        result.variables.push(varMatch[2]);
      }
      
      // Detect short variable declarations
      const shortVarMatch = line.match(shortVarRegex);
      if (shortVarMatch) {
        result.variables.push(shortVarMatch[1]);
      }
      
      // Detect Go patterns
      if (line.includes('go func') || line.match(/\bgo\s+[a-zA-Z0-9_]+/)) {
        hasGoroutines = true;
      }
      
      if (line.includes('chan ') || line.includes('<-')) {
        hasChannels = true;
      }
      
      if (line.includes('context.') || line.includes('ctx.')) {
        hasContexts = true;
      }
      
      if (line.startsWith('defer ')) {
        hasDeferStatements = true;
      }
    }
    
    // Convert package set to array
    result.packages = Array.from(result.packages);
    
    // Add detected patterns
    if (isTestFile) result.patterns.push('Go Testing');
    if (hasGoroutines) result.patterns.push('Goroutines');
    if (hasChannels) result.patterns.push('Channel-based Concurrency');
    if (hasContexts) result.patterns.push('Context-based APIs');
    if (hasDeferStatements) result.patterns.push('Resource Cleanup with defer');
    
    // Check for common frameworks
    const fullContent = content.toString();
    
    if (fullContent.includes('gin.')) {
      result.patterns.push('Gin Framework');
    }
    
    if (fullContent.includes('echo.')) {
      result.patterns.push('Echo Framework');
    }
    
    if (fullContent.includes('gorm.')) {
      result.patterns.push('GORM ORM');
    }
    
    if (fullContent.includes('database/sql')) {
      result.patterns.push('Standard SQL Package');
    }
    
    // Detect naming conventions
    const namingConventions = detectGoNamingConventions(result);
    
    return {
      ...result,
      ...namingConventions
    };
  } catch (error) {
    throw new Error(`Go analysis failed: ${error.message}`);
  }
}

/**
 * Analyzes naming conventions used in Go code
 * 
 * @param {Object} analysis - Analysis data with variables, functions, structs, etc.
 * @returns {Object} Naming convention analysis
 */
function detectGoNamingConventions(analysis) {
  return {
    variableConvention: detectNamingConvention(analysis.variables),
    functionConvention: detectNamingConvention(analysis.functions),
    structConvention: detectNamingConvention(analysis.structs),
    interfaceConvention: detectNamingConvention(analysis.interfaces)
  };
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
  let camelCase = 0;
  let pascalCase = 0;
  let mixed = 0;
  
  // In Go, the typical conventions are:
  // - camelCase for private elements (starting with lowercase)
  // - PascalCase for exported/public elements (starting with uppercase)
  
  names.forEach(name => {
    if (/^[a-z][a-zA-Z0-9]*$/.test(name)) {
      camelCase++;
    } else if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
      pascalCase++;
    } else {
      mixed++;
    }
  });
  
  // Determine dominant convention
  const total = camelCase + pascalCase + mixed;
  
  if (camelCase > pascalCase && camelCase > mixed && camelCase / total > 0.5) {
    return 'camelCase';
  } else if (pascalCase > camelCase && pascalCase > mixed && pascalCase / total > 0.5) {
    return 'PascalCase';
  } else if (camelCase > 0 && pascalCase > 0 && mixed === 0) {
    // Go typically uses both camelCase and PascalCase depending on visibility
    return 'go-standard';
  } else {
    return 'mixed';
  }
}
