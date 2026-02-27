import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { WEB_UNSUPPORTED_PACKAGES } from '../../../electron/nonmodules.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Get all dependencies from package.json
 * @returns {Object} All dependencies and devDependencies
 */
export function getAllPackages() {
  const packageJsonPath = path.join(__dirname, '../../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
}

/**
 * Separate packages into web-supported and unsupported
 * @returns {Object} { webSupported: [], webUnsupported: [] }
 */
export function categorizePackages() {
  const allPackages = getAllPackages();
  const webSupported = [];
  const webUnsupported = [];

  Object.keys(allPackages).forEach(pkg => {
    if (WEB_UNSUPPORTED_PACKAGES.includes(pkg)) {
      webUnsupported.push(pkg);
    } else {
      webSupported.push(pkg);
    }
  });

  return { webSupported, webUnsupported };
}

/**
 * Check if a specific package supports web
 * @param {string} packageName - Package name to check
 * @returns {boolean} True if package supports web, false otherwise
 */
export function isWebSupported(packageName) {
  return !WEB_UNSUPPORTED_PACKAGES.includes(packageName);
}

/**
 * Generate webpack alias configuration based on package.json dependencies
 * @returns {Object} Alias configuration object
 */
export function generateAlias() {
  const allDeps = getAllPackages();

  const alias = {
    'react-native$': 'react-native-web',
  };

  // Set packages to false if they don't support web
  Object.keys(allDeps).forEach(pkg => {
    if (!isWebSupported(pkg)) {
      alias[pkg] = false;
    }
  });

  return alias;
}

/**
 * Generate webpack fallback configuration based on package.json dependencies
 * @returns {Object} Fallback configuration object
 */
export function generateFallback() {
  const { webUnsupported } = categorizePackages();

  const fallback = {
    fs: false,
    path: false,
    os: false,
    AsyncStorage: false,
    NativeModules: false,
    Platform: false,
  };

  // Add all web-unsupported packages to fallback
  webUnsupported.forEach(pkg => {
    fallback[pkg] = false;
  });

  return fallback;
}
