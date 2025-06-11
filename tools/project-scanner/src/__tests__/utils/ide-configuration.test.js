/**
 * Tests for IDE configuration module
 */

import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import {
  IDE_CONFIGURATIONS,
  getIDEConfigById,
  getIDEConfigPaths,
  detectIDEs
} from '../../utils/ide-configuration.js';
import path from 'path';
import fs from 'fs';

// Mock fs functions
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn()
}));

describe('IDE Configuration Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should export IDE configurations', () => {
    expect(Array.isArray(IDE_CONFIGURATIONS)).toBe(true);
    expect(IDE_CONFIGURATIONS.length).toBeGreaterThan(0);

    // Check that each IDE configuration has required properties
    for (const config of IDE_CONFIGURATIONS) {
      expect(config).toHaveProperty('id');
      expect(config).toHaveProperty('name');
      expect(config).toHaveProperty('configFolder');
      expect(config).toHaveProperty('rulesFolder');
    }
  });

  test('getIDEConfigById should return correct config', () => {
    const vscodeConfig = getIDEConfigById('vscode');
    expect(vscodeConfig).not.toBeNull();
    expect(vscodeConfig.id).toBe('vscode');
    expect(vscodeConfig.name).toBe('VS Code');

    // Non-existent IDE should return null
    expect(getIDEConfigById('non-existent')).toBeNull();
  });

  test('getIDEConfigPaths should return correct paths', () => {
    const projectPath = '/test/project';
    const paths = getIDEConfigPaths('vscode', projectPath);

    expect(paths.configPath).toBe(path.join(projectPath, '.vscode'));
    expect(paths.rulePath).toBe(path.join(projectPath, '.vscode/ai-rules'));

    // Non-existent IDE should use generic paths
    const genericPaths = getIDEConfigPaths('non-existent', projectPath);
    expect(genericPaths.configPath).toBe(path.join(projectPath, '.ai'));
  });

  test('detectIDEs should find IDEs based on config files', () => {
    // Set up mock to return true for VS Code and Cursor config folders
    fs.existsSync.mockImplementation((path) => {
      return path.includes('.vscode') || path.includes('.cursor');
    });

    const projectPath = '/test/project';
    const detected = detectIDEs(projectPath);

    expect(detected.length).toBe(2);
    expect(detected[0].id).toBe('vscode');
    expect(detected[1].id).toBe('cursor');

    // Verify existsSync was called for each IDE
    expect(fs.existsSync).toHaveBeenCalledTimes(IDE_CONFIGURATIONS.length);
  });
});
