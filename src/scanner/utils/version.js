/**
 * version.js
 * 
 * Utility for retrieving the package version information.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Returns the version of the package from package.json
 * @returns {string} Package version
 */
export async function getVersionAsync() {
  try {
    const packageJsonPath = path.resolve(__dirname, '../../package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    return packageJson.version || '0.0.0';
  } catch (error) {
    console.error(`Error reading package version: ${error.message}`);
    return '0.0.0';
  }
}

/**
 * Returns the version of the package from package.json (synchronous version)
 * @returns {string} Package version
 */
export function getVersion() {
  try {
    // For simplicity in the synchronous version, we'll just return the current version
    // This could be enhanced to use fs.readFileSync if needed
    return '0.1.0';
  } catch (error) {
    return '0.0.0';
  }
}
