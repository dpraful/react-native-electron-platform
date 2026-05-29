import { getDependencies, categorizePackages, isWebSupported, generateAlias, generateFallback } from '../lib/webpackConfigHelper.mjs';
import { WEB_UNSUPPORTED_PACKAGES } from './electron/nonmodules.mjs';

console.log('Testing webpackConfigHelper...');

// Test getDependencies
const dependencies = getDependencies();
console.log('Dependencies:', Object.keys(dependencies));

// Test categorizePackages
const { webSupported, webUnsupported } = categorizePackages();
console.log('Web supported:', webSupported.length);
console.log('Web unsupported:', webUnsupported.length);

// Test isWebSupported
console.log('react-native-web supported:', isWebSupported('react-native-web'));
console.log('react-native-fs supported:', isWebSupported('react-native-fs'));

// Test generateAlias
const alias = generateAlias();
console.log('Alias keys:', Object.keys(alias));

// Test generateFallback
const fallback = generateFallback();
console.log('Fallback keys:', Object.keys(fallback));

console.log('Tests completed.');
