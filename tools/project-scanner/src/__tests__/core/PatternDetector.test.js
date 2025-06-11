/**
 * Tests for the PatternDetector class
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { PatternDetector } from '../../core/PatternDetector.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('PatternDetector', () => {
  const fixturesPath = path.join(__dirname, '../fixtures');
  const simpleProjectPath = path.join(fixturesPath, 'simple-js-project');

  let detector;
  let mockProjectStructure;
  let mockTechData;

  beforeEach(() => {
    detector = new PatternDetector({
      verbose: false
    });

    // Mock project structure data based on our fixture
    mockProjectStructure = {
      root: simpleProjectPath,
      files: [
        path.join(simpleProjectPath, 'package.json'),
        path.join(simpleProjectPath, 'index.js'),
        path.join(simpleProjectPath, 'src/app.js')
      ],
      directories: [
        path.join(simpleProjectPath, 'src')
      ],
      fileTypes: {
        'js': 2,
        'json': 1
      },
      fileCount: 3,
      directoryCount: 1
    };

    // Mock tech stack data
    mockTechData = {
      primaryLanguages: ['javascript'],
      frameworks: ['Express', 'React'],
      libraries: [],
      testingFrameworks: ['Jest'],
      buildTools: [],
      linters: []
    };
  });

  describe('constructor', () => {
    test('should initialize with default options', () => {
      const defaultDetector = new PatternDetector();
      expect(defaultDetector).toBeDefined();
      expect(defaultDetector.verbose).toBe(false);
    });

    test('should initialize with custom options', () => {
      const customDetector = new PatternDetector({
        verbose: true
      });
      expect(customDetector.verbose).toBe(true);
    });
  });

  describe('detectPatterns', () => {
    test('should detect patterns from project structure and tech stack', async () => {
      const patterns = await detector.detectPatterns(mockProjectStructure, mockTechData);

      expect(patterns).toBeDefined();
      expect(patterns.architecturalPatterns).toBeDefined();
      expect(patterns.namingConventions).toBeDefined();
    });
  });

  describe('detectArchitecturalPatterns', () => {
    test('should detect basic patterns from directory structure', () => {
      // Create a structure that suggests MVC pattern
      const mvcStructure = {
        ...mockProjectStructure,
        directories: [
          path.join(simpleProjectPath, 'src'),
          path.join(simpleProjectPath, 'src/models'),
          path.join(simpleProjectPath, 'src/views'),
          path.join(simpleProjectPath, 'src/controllers')
        ]
      };

      const patterns = detector.detectArchitecturalPatterns(mvcStructure, mockTechData);

      expect(patterns).toContain('MVC');
    });

    test('should detect React patterns when using React', () => {
      const reactTechData = {
        ...mockTechData,
        frameworks: ['React']
      };

      // Create a structure that suggests React component pattern
      const reactStructure = {
        ...mockProjectStructure,
        directories: [
          path.join(simpleProjectPath, 'src'),
          path.join(simpleProjectPath, 'src/components'),
          path.join(simpleProjectPath, 'src/hooks')
        ]
      };

      const patterns = detector.detectArchitecturalPatterns(reactStructure, reactTechData);

      expect(patterns).toContain('Component-Based');
    });

    test('should handle empty structures', () => {
      const patterns = detector.detectArchitecturalPatterns({
        directories: []
      }, {});

      expect(patterns).toEqual([]);
    });
  });

  describe('detectNamingConventions', () => {
    test('should detect JavaScript naming conventions', async () => {
      const jsConventions = await detector.detectNamingConventions(mockProjectStructure, {
        primaryLanguages: ['javascript']
      });

      expect(jsConventions).toHaveProperty('variables');
      expect(jsConventions).toHaveProperty('functions');
      expect(jsConventions).toHaveProperty('classes');
    });

    test('should handle unsupported languages', async () => {
      const conventions = await detector.detectNamingConventions(mockProjectStructure, {
        primaryLanguages: ['unsupported-language']
      });

      // Should fall back to default conventions
      expect(conventions).toHaveProperty('variables');
    });

    test('should handle errors in analyzers', async () => {
      // Mock the analyzer to throw an error
      detector.getAnalyzerForLanguage = () => {
        return {
          analyzeNamingConventions: () => {
            throw new Error('Test error');
          }
        };
      };

      const conventions = await detector.detectNamingConventions(mockProjectStructure, {
        primaryLanguages: ['javascript']
      });

      // Should still return a valid object with defaults
      expect(conventions).toHaveProperty('variables');
    });
  });
});
