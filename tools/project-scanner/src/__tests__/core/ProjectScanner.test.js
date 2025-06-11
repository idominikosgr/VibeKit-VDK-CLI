/**
 * Tests for the ProjectScanner class
 */

import { jest } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProjectScanner } from '../../core/ProjectScanner.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('ProjectScanner', () => {
  const fixturesPath = path.join(__dirname, '../fixtures');
  const simpleProjectPath = path.join(fixturesPath, 'simple-js-project');

  let scanner;

  beforeEach(() => {
    scanner = new ProjectScanner({
      verbose: false,
      ignorePatterns: ['node_modules', '.git']
    });
  });

  describe('constructor', () => {
    test('should initialize with default options', () => {
      const defaultScanner = new ProjectScanner();
      expect(defaultScanner).toBeDefined();
      expect(defaultScanner.verbose).toBe(false);
      expect(defaultScanner.ignorePatterns).toContain('node_modules');
    });

    test('should initialize with custom options', () => {
      const customScanner = new ProjectScanner({
        verbose: true,
        ignorePatterns: ['custom_pattern', 'another_pattern']
      });
      expect(customScanner.verbose).toBe(true);
      expect(customScanner.ignorePatterns).toContain('custom_pattern');
      expect(customScanner.ignorePatterns).toContain('another_pattern');
    });
  });

  describe('scanProject', () => {
    test('should return project structure for simple project', async () => {
      const result = await scanner.scanProject(simpleProjectPath);

      // Validate basic project structure
      expect(result).toBeDefined();
      expect(result.root).toBe(simpleProjectPath);
      expect(result.fileCount).toBeGreaterThan(0);
      expect(result.directoryCount).toBeGreaterThan(0);

      // Validate file types detected
      expect(result.fileTypes).toBeDefined();
      expect(Object.keys(result.fileTypes)).toContain('js');
      expect(Object.keys(result.fileTypes)).toContain('json');

      // Validate file listing
      expect(result.files).toContain(expect.stringContaining('package.json'));
      expect(result.files).toContain(expect.stringContaining('index.js'));
    });

    test('should handle non-existent directory', async () => {
      await expect(async () => {
        await scanner.scanProject(path.join(fixturesPath, 'non-existent-dir'));
      }).rejects.toThrow();
    });

    test('should respect ignore patterns', async () => {
      const customScanner = new ProjectScanner({
        ignorePatterns: ['**/src/**'] // Ignore src directory
      });

      const result = await customScanner.scanProject(simpleProjectPath);

      // Should not contain files from src directory
      expect(result.files).not.toContain(expect.stringContaining('app.js'));
    });
  });

  describe('detectGitIgnorePatterns', () => {
    test('should parse .gitignore if present', async () => {
      // Mock implementation since we don't have an actual .gitignore in the fixture
      const mockFs = {
        readFile: jest.fn().mockResolvedValue('node_modules\n.DS_Store\n*.log')
      };

      // Replace the fs implementation for this test
      const originalFs = scanner.fs;
      scanner.fs = mockFs;

      // Create a mock fs.promises.access function that resolves
      scanner.fs.access = jest.fn().mockResolvedValue(undefined);

      const patterns = await scanner.detectGitIgnorePatterns(simpleProjectPath);

      // Restore original fs
      scanner.fs = originalFs;

      expect(patterns).toContain('node_modules');
      expect(patterns).toContain('.DS_Store');
      expect(patterns).toContain('*.log');
    });

    test('should handle missing .gitignore', async () => {
      // Mock implementation to simulate missing .gitignore
      const mockFs = {
        access: jest.fn().mockRejectedValue(new Error('File not found'))
      };

      // Replace the fs implementation for this test
      const originalFs = scanner.fs;
      scanner.fs = mockFs;

      const patterns = await scanner.detectGitIgnorePatterns(simpleProjectPath);

      // Restore original fs
      scanner.fs = originalFs;

      expect(patterns).toEqual([]);
    });
  });
});
