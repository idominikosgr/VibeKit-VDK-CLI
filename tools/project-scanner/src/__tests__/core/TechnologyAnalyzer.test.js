/**
 * Tests for the TechnologyAnalyzer class
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { TechnologyAnalyzer } from '../../core/TechnologyAnalyzer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('TechnologyAnalyzer', () => {
  const fixturesPath = path.join(__dirname, '../fixtures');
  const simpleProjectPath = path.join(fixturesPath, 'simple-js-project');

  let analyzer;
  let mockProjectStructure;

  beforeEach(() => {
    analyzer = new TechnologyAnalyzer({
      verbose: false
    });

    // Mock project structure data based on our fixture
    mockProjectStructure = {
      root: simpleProjectPath,
      files: [
        path.join(simpleProjectPath, 'package.json'),
        path.join(simpleProjectPath, 'index.js'),
        path.join(simpleProjectPath, 'src/app.js'),
        path.join(simpleProjectPath, 'jest.config.js')
      ],
      fileTypes: {
        'js': 3,
        'json': 1
      },
      fileCount: 4,
      directoryCount: 1
    };
  });

  describe('constructor', () => {
    test('should initialize with default options', () => {
      const defaultAnalyzer = new TechnologyAnalyzer();
      expect(defaultAnalyzer).toBeDefined();
      expect(defaultAnalyzer.verbose).toBe(false);
    });

    test('should initialize with custom options', () => {
      const customAnalyzer = new TechnologyAnalyzer({
        verbose: true
      });
      expect(customAnalyzer.verbose).toBe(true);
    });
  });

  describe('analyzeProject', () => {
    test('should detect JavaScript as primary language', async () => {
      const result = await analyzer.analyzeProject(mockProjectStructure);

      expect(result.primaryLanguages).toContain('javascript');
    });

    test('should detect Express framework', async () => {
      const result = await analyzer.analyzeProject(mockProjectStructure);

      expect(result.frameworks).toContain('Express');
    });

    test('should detect React library', async () => {
      const result = await analyzer.analyzeProject(mockProjectStructure);

      expect(result.libraries).toContain('React');
    });

    test('should detect Jest testing framework', async () => {
      const result = await analyzer.analyzeProject(mockProjectStructure);

      expect(result.testingFrameworks).toContain('Jest');
    });
  });

  describe('detectLanguages', () => {
    test('should detect languages based on file extensions', () => {
      const languages = analyzer.detectLanguages(mockProjectStructure.fileTypes);

      expect(languages).toContain('javascript');
      expect(languages.length).toBeGreaterThan(0);
    });

    test('should handle empty file types', () => {
      const languages = analyzer.detectLanguages({});

      expect(languages).toEqual([]);
    });
  });

  describe('analyzePackageJson', () => {
    test('should parse package.json and extract dependencies', async () => {
      const packageData = await analyzer.analyzePackageJson(mockProjectStructure);

      expect(packageData.name).toBe('simple-test-project');
      expect(packageData.dependencies).toHaveProperty('express');
      expect(packageData.dependencies).toHaveProperty('react');
      expect(packageData.devDependencies).toHaveProperty('jest');
    });

    test('should handle missing package.json', async () => {
      // Create a structure without package.json
      const noPackageStructure = {
        ...mockProjectStructure,
        files: mockProjectStructure.files.filter(f => !f.endsWith('package.json'))
      };

      const packageData = await analyzer.analyzePackageJson(noPackageStructure);

      expect(packageData).toEqual({});
    });
  });

  describe('detectFrameworksFromDependencies', () => {
    test('should detect frameworks from dependencies', () => {
      const dependencies = {
        'express': '^4.18.0',
        'react': '^18.0.0',
        'react-dom': '^18.0.0',
        '@angular/core': '^13.0.0',
        'next': '^12.0.0'
      };

      const frameworks = analyzer.detectFrameworksFromDependencies(dependencies);

      expect(frameworks).toContain('Express');
      expect(frameworks).toContain('React');
      expect(frameworks).toContain('Next.js');
    });

    test('should handle empty dependencies', () => {
      const frameworks = analyzer.detectFrameworksFromDependencies({});

      expect(frameworks).toEqual([]);
    });
  });
});
