/**
 * Integration tests for DependencyAnalyzer and PatternDetector
 */

import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { DependencyAnalyzer } from '../../core/DependencyAnalyzer.js';
import { PatternDetector } from '../../core/PatternDetector.js';
import fs from 'fs';
import path from 'path';

// Mock console functions for tests
global.console = {
  ...global.console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Sample project structure for tests
const testProjectStructure = {
  root: '/test-project',
  files: [
    {
      path: '/test-project/src/models/User.js',
      name: 'User.js',
      type: 'javascript',
      content: `
        import { BaseModel } from './BaseModel';
        import { validate } from '../utils/validation';

        export class User extends BaseModel {
          constructor(data) {
            super();
            this.name = data.name;
            this.email = data.email;
          }

          validate() {
            return validate(this);
          }
        }
      `
    },
    {
      path: '/test-project/src/controllers/UserController.js',
      name: 'UserController.js',
      type: 'javascript',
      content: `
        import { User } from '../models/User';
        import { BaseController } from './BaseController';

        export class UserController extends BaseController {
          async getUser(id) {
            return await this.userService.findById(id);
          }

          async createUser(data) {
            const user = new User(data);
            if (user.validate()) {
              return await this.userService.save(user);
            }
            throw new Error('Invalid user data');
          }
        }
      `
    },
    {
      path: '/test-project/src/views/UserView.js',
      name: 'UserView.js',
      type: 'javascript',
      content: `
        import { User } from '../models/User';
        import { renderTemplate } from '../utils/template';

        export function renderUserProfile(user) {
          return renderTemplate('user-profile', user);
        }
      `
    }
  ],
  directories: [
    { name: 'src', path: '/test-project/src' },
    { name: 'models', path: '/test-project/src/models' },
    { name: 'controllers', path: '/test-project/src/controllers' },
    { name: 'views', path: '/test-project/src/views' },
    { name: 'utils', path: '/test-project/src/utils' }
  ]
};

// Mock fs.readFile to return file content from our structure
jest.mock('fs/promises', () => ({
  readFile: jest.fn((filePath) => {
    const file = testProjectStructure.files.find(f => f.path === filePath);
    if (file && file.content) {
      return Promise.resolve(file.content);
    }
    return Promise.reject(new Error(`File not found: ${filePath}`));
  })
}));

describe('Enhanced Pattern Detection Integration', () => {
  let dependencyAnalyzer;
  let patternDetector;

  beforeEach(() => {
    dependencyAnalyzer = new DependencyAnalyzer({ verbose: false });
    patternDetector = new PatternDetector({ verbose: false });
  });

  test('DependencyAnalyzer should detect dependencies between modules', async () => {
    const result = await dependencyAnalyzer.analyzeDependencies(testProjectStructure, {});

    // Check that the dependency graph was built
    expect(result.moduleCount).toBeGreaterThan(0);
    expect(result.architecturalHints.length).toBeGreaterThan(0);
  });

  test('PatternDetector should detect MVC pattern using directory structure', async () => {
    const patterns = await patternDetector.detectPatterns(testProjectStructure);

    // Should detect MVC based on directory names
    const hasDetectedMVC = patterns.architecturalPatterns.some(p => p.name === 'MVC');
    expect(hasDetectedMVC).toBe(true);
  });

  test('PatternDetector should use dependency analysis to enhance pattern detection', async () => {
    // Access internal dependency analyzer
    const spy = jest.spyOn(patternDetector.dependencyAnalyzer, 'analyzeDependencies');

    await patternDetector.detectPatterns(testProjectStructure);

    // Verify dependency analyzer was called
    expect(spy).toHaveBeenCalled();
  });
});
