/**
 * java.js
 * 
 * Analyzer for Java code to detect naming conventions, patterns,
 * and other Java-specific elements.
 */

import fs from 'fs/promises';

/**
 * Analyzes Java code to detect naming conventions and patterns
 * 
 * @param {string} filePath - Path to the Java file
 * @returns {Object} Analysis results containing detected patterns and conventions
 */
export async function analyzeJava(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    
    const result = {
      variables: [],
      methods: [],
      classes: [],
      interfaces: [],
      packages: [],
      imports: [],
      annotations: [],
      patterns: []
    };
    
    // Package and import detection
    const packageRegex = /^package\s+([a-zA-Z0-9_.]+);/;
    const importRegex = /^import\s+(?:static\s+)?([a-zA-Z0-9_.*]+);/;
    
    // Class and interface detection
    const classRegex = /^(?:public|private|protected)?\s*(?:abstract|final)?\s*class\s+([a-zA-Z0-9_]+)(?:<[^>]+>)?\s*(?:extends\s+[a-zA-Z0-9_.<>]+)?\s*(?:implements\s+[a-zA-Z0-9_.<>, ]+)?\s*\{/;
    const interfaceRegex = /^(?:public|private|protected)?\s*interface\s+([a-zA-Z0-9_]+)(?:<[^>]+>)?\s*(?:extends\s+[a-zA-Z0-9_.<>, ]+)?\s*\{/;
    
    // Method detection
    const methodRegex = /^(?:\s*)(?:public|private|protected)?\s*(?:static|final|abstract)?\s*(?:<[^>]+>\s*)?(?:[a-zA-Z0-9_.<>[\]]+)\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*(?:throws\s+[a-zA-Z0-9_, ]+)?\s*(?:\{|;)/;
    
    // Variable detection
    const fieldRegex = /^(?:\s*)(?:public|private|protected)?\s*(?:static|final)?\s*(?:[a-zA-Z0-9_.<>[\]]+)\s+([a-zA-Z0-9_]+)\s*(?:=|;)/;
    
    // Annotation detection
    const annotationRegex = /^(?:\s*)@([a-zA-Z0-9_]+)(?:\([^)]*\))?/;
    
    // Common framework patterns
    const frameworkPatterns = {
      spring: /(?:@Controller|@Service|@Repository|@Component|@Autowired|@SpringBootApplication)/,
      hibernate: /(?:@Entity|@Table|@Column|@Id|@GeneratedValue)/,
      junit: /(?:@Test|@Before|@After|@BeforeClass|@AfterClass)/,
      javaEE: /(?:@EJB|@Stateless|@Stateful|@MessageDriven|@WebServlet)/,
      lombok: /(?:@Data|@Getter|@Setter|@Builder|@NoArgsConstructor|@AllArgsConstructor|@RequiredArgsConstructor)/,
      reactive: /(?:Flux|Mono|Publisher|Subscriber|Subscription)/,
      functional: /(?:Function<|Predicate<|Consumer<|Supplier<|BiFunction<|CompletableFuture<)/,
      streams: /\.stream\(\)|\.filter\(|\.map\(|\.flatMap\(|\.collect\(/
    };
    
    // Analyze each line
    let insideComment = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Handle multi-line comments
      if (line.includes('/*')) insideComment = true;
      if (line.includes('*/')) {
        insideComment = false;
        continue;
      }
      if (insideComment || line.startsWith('//')) continue;
      
      // Detect package
      const packageMatch = line.match(packageRegex);
      if (packageMatch && !result.packages.includes(packageMatch[1])) {
        result.packages.push(packageMatch[1]);
      }
      
      // Detect imports
      const importMatch = line.match(importRegex);
      if (importMatch && !result.imports.includes(importMatch[1])) {
        result.imports.push(importMatch[1]);
      }
      
      // Detect classes
      const classMatch = line.match(classRegex);
      if (classMatch && !result.classes.includes(classMatch[1])) {
        result.classes.push(classMatch[1]);
      }
      
      // Detect interfaces
      const interfaceMatch = line.match(interfaceRegex);
      if (interfaceMatch && !result.interfaces.includes(interfaceMatch[1])) {
        result.interfaces.push(interfaceMatch[1]);
      }
      
      // Detect methods
      const methodMatch = line.match(methodRegex);
      if (methodMatch && !result.methods.includes(methodMatch[1])) {
        result.methods.push(methodMatch[1]);
      }
      
      // Detect variables/fields
      const fieldMatch = line.match(fieldRegex);
      if (fieldMatch && !result.variables.includes(fieldMatch[1])) {
        result.variables.push(fieldMatch[1]);
      }
      
      // Detect annotations
      const annotationMatch = line.match(annotationRegex);
      if (annotationMatch && !result.annotations.includes(annotationMatch[1])) {
        result.annotations.push(annotationMatch[1]);
      }
    }
    
    // Detect Java framework patterns
    const fullContent = content.toString();
    
    // Check for Spring Framework
    if (frameworkPatterns.spring.test(fullContent) || result.imports.some(imp => imp.includes('org.springframework'))) {
      result.patterns.push('Spring Framework');
    }
    
    // Check for Hibernate/JPA
    if (frameworkPatterns.hibernate.test(fullContent) || result.imports.some(imp => imp.includes('javax.persistence') || imp.includes('org.hibernate'))) {
      result.patterns.push('Hibernate/JPA');
    }
    
    // Check for JUnit
    if (frameworkPatterns.junit.test(fullContent) || result.imports.some(imp => imp.includes('org.junit'))) {
      result.patterns.push('JUnit Testing');
    }
    
    // Check for Java EE
    if (frameworkPatterns.javaEE.test(fullContent) || result.imports.some(imp => imp.includes('javax.ejb') || imp.includes('javax.servlet'))) {
      result.patterns.push('Java EE');
    }
    
    // Check for Lombok
    if (frameworkPatterns.lombok.test(fullContent) || result.imports.some(imp => imp.includes('lombok'))) {
      result.patterns.push('Lombok');
    }
    
    // Check for reactive programming
    if (frameworkPatterns.reactive.test(fullContent) || result.imports.some(imp => imp.includes('reactor') || imp.includes('rxjava'))) {
      result.patterns.push('Reactive Programming');
    }
    
    // Check for functional programming patterns
    if (frameworkPatterns.functional.test(fullContent)) {
      result.patterns.push('Functional Programming');
    }
    
    // Check for Java Streams API
    if (frameworkPatterns.streams.test(fullContent)) {
      result.patterns.push('Java Streams API');
    }
    
    // Analyze naming conventions
    const namingConventions = detectJavaNamingConventions(result);
    
    return {
      ...result,
      ...namingConventions
    };
  } catch (error) {
    throw new Error(`Java analysis failed: ${error.message}`);
  }
}

/**
 * Analyzes naming conventions used in Java code
 * 
 * @param {Object} analysis - Analysis data with variables, methods, classes, etc.
 * @returns {Object} Naming convention analysis
 */
function detectJavaNamingConventions(analysis) {
  return {
    variableConvention: detectNamingConvention(analysis.variables),
    methodConvention: detectNamingConvention(analysis.methods),
    classConvention: detectNamingConvention(analysis.classes),
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
  let snakeCase = 0;
  let screaming = 0;
  let mixed = 0;
  
  // Standard Java conventions:
  // - camelCase for variables, methods
  // - PascalCase for classes, interfaces
  // - SCREAMING_SNAKE_CASE for constants
  
  names.forEach(name => {
    if (/^[a-z][a-zA-Z0-9]*$/.test(name)) {
      camelCase++;
    } else if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
      pascalCase++;
    } else if (/^[a-z][a-z0-9_]*$/.test(name)) {
      snakeCase++;
    } else if (/^[A-Z][A-Z0-9_]*$/.test(name)) {
      screaming++;
    } else {
      mixed++;
    }
  });
  
  // Find the most common convention
  const max = Math.max(camelCase, pascalCase, snakeCase, screaming, mixed);
  const total = camelCase + pascalCase + snakeCase + screaming + mixed;
  
  // Return the dominant convention if it represents at least 50% of all names
  if (max / total >= 0.5) {
    if (max === camelCase) return 'camelCase';
    if (max === pascalCase) return 'PascalCase';
    if (max === snakeCase) return 'snake_case';
    if (max === screaming) return 'SCREAMING_SNAKE_CASE';
    if (max === mixed) return 'mixed';
  }
  
  return 'mixed';
}
