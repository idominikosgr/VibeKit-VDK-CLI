/**
 * Tests for the GitIgnoreParser utility
 */

import { jest } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GitIgnoreParser } from '../../utils/gitignore-parser.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('GitIgnoreParser', () => {
  // Mock fs functions for testing
  const originalFsAccess = fs.access;
  const originalFsReadFile = fs.readFile;

  // Setup mock .gitignore content
  const mockGitIgnoreContent = `
# Node.js
node_modules
npm-debug.log
yarn-error.log

# Build output
/dist
/build

# Environment
.env
.env.local

# Editor directories
.idea
.vscode
*.sublime-*

# OS generated
.DS_Store
Thumbs.db
  `.trim();

  beforeEach(() => {
    // Reset mocks
    fs.access = jest.fn().mockResolvedValue(undefined);
    fs.readFile = jest.fn().mockResolvedValue(mockGitIgnoreContent);
  });

  afterEach(() => {
    // Restore original fs functions
    fs.access = originalFsAccess;
    fs.readFile = originalFsReadFile;
  });

  describe('parseGitIgnore', () => {
    test('should parse .gitignore file and return patterns', async () => {
      const projectPath = '/test/project';

      const patterns = await GitIgnoreParser.parseGitIgnore(projectPath);

      // Verify fs.access was called with correct path
      expect(fs.access).toHaveBeenCalledWith(path.join(projectPath, '.gitignore'));

      // Verify fs.readFile was called with correct path
      expect(fs.readFile).toHaveBeenCalledWith(path.join(projectPath, '.gitignore'), 'utf8');

      // Verify patterns were extracted
      expect(patterns).toContain('node_modules');
      expect(patterns).toContain('/dist');
      expect(patterns).toContain('.env');
    });

    test('should handle non-existent .gitignore file', async () => {
      // Make fs.access throw to simulate missing file
      fs.access = jest.fn().mockRejectedValue(new Error('File not found'));

      const projectPath = '/test/project';

      const patterns = await GitIgnoreParser.parseGitIgnore(projectPath);

      // Should return empty array
      expect(patterns).toEqual([]);
    });

    test('should handle errors during parsing', async () => {
      // Make fs.readFile throw to simulate error
      fs.readFile = jest.fn().mockRejectedValue(new Error('Read error'));

      const projectPath = '/test/project';

      // Spy on console.warn
      const originalWarn = console.warn;
      console.warn = jest.fn();

      try {
        const patterns = await GitIgnoreParser.parseGitIgnore(projectPath);

        // Should return empty array
        expect(patterns).toEqual([]);

        // Should log warning
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Error parsing .gitignore'));
      } finally {
        // Restore console.warn
        console.warn = originalWarn;
      }
    });
  });

  describe('convertToGlobPatterns', () => {
    test('should convert gitignore patterns to glob patterns', () => {
      const projectPath = '/test/project';

      const patterns = GitIgnoreParser.convertToGlobPatterns(mockGitIgnoreContent, projectPath);

      // Check common patterns
      expect(patterns).toContain('node_modules');
      expect(patterns).toContain('/dist');
      expect(patterns).toContain('.env');
      expect(patterns).toContain('*.sublime-*');
    });

    test('should filter out comments and empty lines', () => {
      const content = `
# This is a comment
node_modules
# Another comment

# Empty line above
.env
      `;

      const projectPath = '/test/project';

      const patterns = GitIgnoreParser.convertToGlobPatterns(content, projectPath);

      // Should only have two patterns
      expect(patterns).toHaveLength(2);
      expect(patterns).toContain('node_modules');
      expect(patterns).toContain('.env');
    });

    test('should handle leading slashes', () => {
      const content = '/dist\n/build';
      const projectPath = '/test/project';

      const patterns = GitIgnoreParser.convertToGlobPatterns(content, projectPath);

      expect(patterns).toContain('/dist');
      expect(patterns).toContain('/build');
    });
  });
});
