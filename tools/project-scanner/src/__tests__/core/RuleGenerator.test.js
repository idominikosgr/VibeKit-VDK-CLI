/**
 * Tests for the RuleGenerator class
 */

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';
import { RuleGenerator } from '../../core/RuleGenerator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('RuleGenerator', () => {
  const fixturesPath = path.join(__dirname, '../fixtures');
  const outputPath = path.join(fixturesPath, 'output');

  let generator;
  let mockAnalysisData;

  beforeEach(async () => {
    // Create output directory if it doesn't exist
    try {
      await fs.mkdir(outputPath, { recursive: true });
    } catch (error) {
      // Ignore errors
    }

    generator = new RuleGenerator({
      verbose: false,
      outputPath
    });

    // Mock analysis data
    mockAnalysisData = {
      projectStructure: {
        root: path.join(fixturesPath, 'simple-js-project'),
        fileCount: 5,
        directoryCount: 2,
        fileTypes: {
          js: 3,
          json: 1,
          md: 1
        }
      },
      techStack: {
        primaryLanguages: ['javascript'],
        frameworks: ['Express', 'React'],
        libraries: [],
        testingFrameworks: ['Jest'],
        buildTools: [],
        linters: []
      },
      patterns: {
        architecturalPatterns: ['Component-Based'],
        namingConventions: {
          variables: 'camelCase',
          functions: 'camelCase',
          classes: 'PascalCase',
          constants: 'UPPER_SNAKE_CASE'
        }
      }
    };

    // Mock method to avoid actual file system operations
    generator.getTemplateContent = jest.fn().mockResolvedValue('# {{projectName}} {{date}}\n\n## Tech Stack\n\n{{#each frameworks}}{{this}},{{/each}}');
  });

  afterEach(async () => {
    // Clean up output directory
    try {
      // List all files in output directory
      const files = await fs.readdir(outputPath);

      // Delete each file
      for (const file of files) {
        await fs.unlink(path.join(outputPath, file));
      }

      // Delete output directory
      await fs.rmdir(outputPath);
    } catch (error) {
      // Ignore errors
    }
  });

  describe('constructor', () => {
    test('should initialize with default options', () => {
      const defaultGenerator = new RuleGenerator();
      expect(defaultGenerator).toBeDefined();
      expect(defaultGenerator.verbose).toBe(false);
      expect(defaultGenerator.outputPath).toBeDefined();
    });

    test('should initialize with custom options', () => {
      const customGenerator = new RuleGenerator({
        verbose: true,
        outputPath: '/custom/path'
      });
      expect(customGenerator.verbose).toBe(true);
      expect(customGenerator.outputPath).toBe('/custom/path');
    });
  });

  describe('generateRules', () => {
    test('should generate rule files based on analysis data', async () => {
      const generatedFiles = await generator.generateRules(mockAnalysisData);

      expect(generatedFiles).toBeDefined();
      expect(generatedFiles.length).toBeGreaterThan(0);
    });

    test('should handle errors during generation', async () => {
      // Mock a method to throw an error
      generator.generateCoreRules = jest.fn().mockRejectedValue(new Error('Test error'));

      await expect(async () => {
        await generator.generateRules(mockAnalysisData);
      }).rejects.toThrow('Rule generation failed');
    });
  });

  describe('generateCoreRules', () => {
    test('should generate core agent rule file', async () => {
      await generator.generateCoreRules(mockAnalysisData);

      expect(generator.generatedFiles).toContain(expect.stringContaining('00-core-agent.mdc'));
    });
  });

  describe('generateProjectContextRule', () => {
    test('should generate project context rule file', async () => {
      await generator.generateProjectContextRule(mockAnalysisData);

      expect(generator.generatedFiles).toContain(expect.stringContaining('01-project-context.mdc'));
    });
  });

  describe('registerHandlebarsHelpers', () => {
    test('should register custom handlebars helpers', () => {
      // Mock Handlebars to verify helpers are registered
      const mockHandlebars = {
        registerHelper: jest.fn()
      };

      // Store original Handlebars
      const originalHandlebars = generator.Handlebars;

      try {
        // Replace with mock
        generator.Handlebars = mockHandlebars;

        // Call the method
        generator.registerHandlebarsHelpers();

        // Verify helpers were registered
        expect(mockHandlebars.registerHelper).toHaveBeenCalled();
      } finally {
        // Restore original
        generator.Handlebars = originalHandlebars;
      }
    });
  });
});
