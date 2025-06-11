/**
 * Tests for the PackageAnalyzer utility
 */

import { jest } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PackageAnalyzer } from '../../utils/package-analyzer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('PackageAnalyzer', () => {
  // Mock fs functions for testing
  const originalFsReadFile = fs.readFile;

  // Example package.json content
  const mockPackageJsonContent = JSON.stringify({
    name: "test-project",
    version: "1.0.0",
    description: "Test project for PackageAnalyzer",
    scripts: {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "jest",
      "lint": "eslint ."
    },
    dependencies: {
      "react": "^18.0.0",
      "react-dom": "^18.0.0",
      "axios": "^1.0.0",
      "express": "^4.17.1"
    },
    devDependencies: {
      "jest": "^27.0.0",
      "eslint": "^8.0.0",
      "typescript": "^4.5.0"
    }
  });

  beforeEach(() => {
    // Reset mocks
    fs.readFile = jest.fn().mockResolvedValue(mockPackageJsonContent);
  });

  afterEach(() => {
    // Restore original fs functions
    fs.readFile = originalFsReadFile;
  });

  describe('analyzePackage', () => {
    test('should parse package.json and return analysis', async () => {
      const packagePath = '/test/project/package.json';

      const analysis = await PackageAnalyzer.analyzePackage(packagePath);

      // Verify fs.readFile was called with correct path
      expect(fs.readFile).toHaveBeenCalledWith(packagePath, 'utf8');

      // Verify key data was extracted
      expect(analysis.name).toBe('test-project');
      expect(analysis.version).toBe('1.0.0');
      expect(analysis.description).toBe('Test project for PackageAnalyzer');

      // Verify dependencies
      expect(analysis.dependencies).toHaveProperty('react');
      expect(analysis.dependencies).toHaveProperty('express');

      // Verify devDependencies
      expect(analysis.devDependencies).toHaveProperty('jest');
      expect(analysis.devDependencies).toHaveProperty('typescript');

      // Verify scripts
      expect(analysis.scripts).toHaveProperty('start');
      expect(analysis.scripts).toHaveProperty('test');
    });

    test('should handle package.json read errors', async () => {
      // Make fs.readFile throw to simulate error
      fs.readFile = jest.fn().mockRejectedValue(new Error('Read error'));

      const packagePath = '/test/project/package.json';

      // Spy on console.warn
      const originalWarn = console.warn;
      console.warn = jest.fn();

      try {
        const analysis = await PackageAnalyzer.analyzePackage(packagePath);

        // Should return empty object
        expect(analysis).toEqual({});

        // Should log warning
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Error analyzing package.json'));
      } finally {
        // Restore console.warn
        console.warn = originalWarn;
      }
    });

    test('should handle invalid JSON in package.json', async () => {
      // Make fs.readFile return invalid JSON
      fs.readFile = jest.fn().mockResolvedValue('{ invalid json }');

      const packagePath = '/test/project/package.json';

      // Spy on console.warn
      const originalWarn = console.warn;
      console.warn = jest.fn();

      try {
        const analysis = await PackageAnalyzer.analyzePackage(packagePath);

        // Should return empty object
        expect(analysis).toEqual({});

        // Should log warning
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Error parsing package.json'));
      } finally {
        // Restore console.warn
        console.warn = originalWarn;
      }
    });
  });

  describe('detectPackageType', () => {
    test('should detect React package', () => {
      const packageData = {
        dependencies: {
          "react": "^18.0.0"
        }
      };

      const type = PackageAnalyzer.detectPackageType(packageData);

      expect(type).toContain('react');
    });

    test('should detect Next.js package', () => {
      const packageData = {
        dependencies: {
          "next": "^13.0.0"
        }
      };

      const type = PackageAnalyzer.detectPackageType(packageData);

      expect(type).toContain('next.js');
    });

    test('should detect TypeScript package', () => {
      const packageData = {
        devDependencies: {
          "typescript": "^4.5.0"
        }
      };

      const type = PackageAnalyzer.detectPackageType(packageData);

      expect(type).toContain('typescript');
    });

    test('should handle empty package data', () => {
      const type = PackageAnalyzer.detectPackageType({});

      expect(type).toEqual([]);
    });
  });

  describe('getTotalDependencies', () => {
    test('should count total dependencies', () => {
      const packageData = {
        dependencies: {
          "react": "^18.0.0",
          "react-dom": "^18.0.0"
        },
        devDependencies: {
          "jest": "^27.0.0"
        }
      };

      const count = PackageAnalyzer.getTotalDependencies(packageData);

      expect(count).toBe(3);
    });

    test('should handle missing dependencies', () => {
      const packageData = {
        name: "test"
      };

      const count = PackageAnalyzer.getTotalDependencies(packageData);

      expect(count).toBe(0);
    });
  });
});
