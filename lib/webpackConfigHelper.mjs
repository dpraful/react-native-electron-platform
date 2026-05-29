import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
let cachedDependencies = null;
let cachedUnsupportedPackages = null;
function readUnsupportedPackagesFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/WEB_UNSUPPORTED_PACKAGES\s*=\s*(\[[\s\S]*?\])/);
    if (!match) {
        return null;
    }
    try {
        const packages = Function(`"use strict"; return (${match[1]});`)();
        return Array.isArray(packages) ? packages : null;
    }
    catch {
        return null;
    }
}
function getWebUnsupportedPackages() {
    if (cachedUnsupportedPackages) {
        return cachedUnsupportedPackages;
    }
    const appFile = path.resolve(process.cwd(), 'electron/nonmodules.mjs');
    const templateFile = path.resolve(packageRoot, 'templates/electron/nonmodules.mjs');
    cachedUnsupportedPackages =
        readUnsupportedPackagesFile(appFile) ||
            readUnsupportedPackagesFile(templateFile) ||
            [];
    return cachedUnsupportedPackages;
}
/**
 * Get ONLY production dependencies from package.json
 * Dev dependencies are unnecessary for webpack alias/fallback optimization
 *
 * @returns {Object} Production dependencies
 */
export function getDependencies() {
    if (cachedDependencies) {
        return cachedDependencies;
    }
    const packageJsonPath = path.join(__dirname, '../../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    cachedDependencies = dependencies;
    return dependencies;
}
/**
 * Separate packages into web-supported and unsupported
 *
 * @returns {Object}
 */
export function categorizePackages() {
    const allPackages = getDependencies();
    const webSupported = [];
    const webUnsupported = [];
    Object.keys(allPackages).forEach(pkg => {
        if (getWebUnsupportedPackages().includes(pkg)) {
            webUnsupported.push(pkg);
        }
        else {
            webSupported.push(pkg);
        }
    });
    return {
        webSupported,
        webUnsupported,
    };
}
/**
 * Check if a package supports web
 *
 * @param {string} packageName
 * @returns {boolean}
 */
export function isWebSupported(packageName) {
    return !getWebUnsupportedPackages().includes(packageName);
}
/**
 * Generate webpack alias configuration
 *
 * IMPORTANT:
 * alias = npm packages/modules
 * fallback = node builtins only
 *
 * @returns {Object}
 */
export function generateAlias() {
    const allDeps = getDependencies();
    const alias = {
        // React Native -> React Native Web
        'react-native$': 'react-native-web',
        // Prevent duplicate React copies
        react: path.resolve(process.cwd(), 'node_modules/react'),
        'react-dom': path.resolve(process.cwd(), 'node_modules/react-dom'),
    };
    /**
     * Disable unsupported packages completely
     */
    Object.keys(allDeps).forEach(pkg => {
        if (!isWebSupported(pkg)) {
            alias[pkg] = false;
        }
    });
    return alias;
}
/**
 * Generate webpack fallback configuration
 *
 * IMPORTANT:
 * fallback ONLY works for Node.js core modules
 *
 * @returns {Object}
 */
export function generateFallback() {
    return {
        // File system
        fs: false,
        // Paths
        path: false,
        // Operating system
        os: false,
        // Crypto/polyfills
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        // Networking
        http: false,
        https: false,
        net: false,
        tls: false,
        // Compression
        zlib: false,
        // Process/child handling
        child_process: false,
        // Misc Node builtins
        module: false,
        vm: false,
        worker_threads: false,
        perf_hooks: false,
        readline: false,
        repl: false,
        dns: false,
        dgram: false,
        cluster: false,
        async_hooks: false,
        inspector: false,
    };
}
