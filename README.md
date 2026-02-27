# react-native-electron-platform

[![npm version](https://badge.fury.io/js/react-native-electron-platform.svg)](https://badge.fury.io/js/react-native-electron-platform)
[![CI](https://github.com/dpraful/react-native-electron-platform/workflows/CI/badge.svg)](https://github.com/dpraful/react-native-electron-platform/actions)

A boilerplate and utility library for running React Native applications in Electron, supporting both desktop and web platforms.

## 🎯 Features

### Core Capabilities
- ⚡ **Electron main process setup** - Pre-configured Electron environment with window management
- 🔄 **Auto-updater integration** - Automatic application update checking and installation
- 🔒 **Secure IPC communication** - Preload script for safe electron context isolation
- 🛠️ **Webpack configuration helper** - Ready-to-use webpack config for React Native web builds
- 🌐 **Cross-platform support** - Build once, run on Electron, Web, Android, and iOS

### Built-in Modules
- 📁 **File Operations** - Read, write, and delete files securely
- 🖨️ **PDF Generation & Preview** - Generate and preview PDF documents
- 📋 **Clipboard Management** - Copy/paste functionality
- 💬 **Dialog System** - File dialogs, save dialogs, message boxes
- 🌐 **Network Service** - Secure HTTP requests from main process
- 🔗 **Deep Linking** - Platform-specific deep link handling
- 🛡️ **Safe Mode** - Recovery utilities for safe application startup

### Security Features
- Main process runs separately from renderer
- Secure IPC communication with preload scripts
- No direct Node.js access from renderer process
- Controlled access to sensitive APIs
- Context isolation support

### Developer Experience
- Hot Module Replacement (HMR) during development
- DevTools integration for debugging
- Cross-platform build tools
- Webpack dev server integration
- Automatic platform detection
- Easy conditional imports per platform

## ✅ System Requirements

- **Node.js** v14.0.0 or higher
- **npm** v6.0.0 or higher
- **Disk space:** ~500MB for node_modules
- **For iOS:** macOS with Xcode
- **For Android:** Android SDK

## ⚡ One Minute Overview

```bash
# 1. Install package
npm install react-native-electron-platform

# 2. Copy example and install
cp -r node_modules/react-native-electron-platform/example-project ../my-app
cd ../my-app && npm install

# 3. Run
npm run electron                    # Electron app with hot reload
npm run web                         # Web on browser
npm run android                     # Android device
npm run ios                         # iOS simulator
npm run electron:build              # Build production app
```

## 📦 Installation

```bash
npm install react-native-electron-platform
```

### Dependencies

You'll also need to install these peer dependencies:

```bash
npm install react react-native cross-env concurrently wait-on electron electron-builder
npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin @babel/core @babel/preset-react babel-loader
```

## 🚀 Quick Start Guide

### ⭐ For New Users - 3 Steps to Get Running

**Step 1: Copy the Example Project**
```bash
# Copy example-project to your desired location
cp -r node_modules/react-native-electron-platform/example-project ../my-electron-app
cd ../my-electron-app
```

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: Run Your App**
```bash
npm run electron
```

Visit `http://localhost:5001` and you'll see your app running in an Electron window!

### 📚 For Detailed Instructions

Read the **[Complete Setup Guide](SETUP.md)** for step-by-step instructions on:
- Creating a new React Native project from scratch
- Installing and configuring react-native-electron-platform
- Setting up project structure
- Running on all platforms (Electron, Web, Android, iOS)
- Building for production

## 📖 How to Use

### Option 1: As an NPM Module (Recommended) ⭐

The easiest and recommended way - install as a package and use pre-configured setup:

```bash
npm install react-native-electron-platform
```

**Update your package.json:**
```json
{
  "private": true,
  "main": "node_modules/react-native-electron-platform/index.mjs",
  "scripts": {
    "web": "webpack serve --config node_modules/react-native-electron-platform/webpack.config.mjs --mode development",
    "web:build": "webpack --config node_modules/react-native-electron-platform/webpack.config.mjs --mode production",
    "electron": "cross-env NODE_ENV=development concurrently \"npm run web\" \"wait-on http://localhost:5001 && electron .\"",
    "electron:dev": "cross-env NODE_ENV=development electron . --enable-remote-module",
    "electron:build": "npm run web:build && electron-builder --config node_modules/react-native-electron-platform/electron-builder.json",
    "electron:build:nsis": "npm run web:build && electron-builder --config node_modules/react-native-electron-platform/electron-builder.json --win nsis --publish never",
    "electron:build:msi": "npm run web:build && electron-builder --config node_modules/react-native-electron-platform/electron-builder.json --win msi --publish never",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "start": "react-native start",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-native": "^0.71.0",
    "react-native-electron-platform": "^0.0.12",
    "cross-env": "^7.0.3",
    "concurrently": "^8.0.0",
    "wait-on": "^7.0.0"
  }
}
```

**Create Project Structure:**
```bash
mkdir -p src electron
```

Create `src/App.js`:
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Electron + React Native!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default App;
```

Create `electron/index.js`:
```javascript
import { AppRegistry } from 'react-native';
import App from '../src/App';

AppRegistry.registerComponent('App', () => App);

const root = document.getElementById('root');
if (root) {
  AppRegistry.runApplication('App', {
    rootTag: root,
  });
}
```

Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
      #root { width: 100%; height: 100vh; }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

**Run Your App:**
```bash
npm run electron
```

### Option 2: As a Boilerplate (Advanced)

For custom use cases, copy specific files to your Electron project:

```bash
# Copy Electron entry point
cp node_modules/react-native-electron-platform/index.mjs ./

# Copy webpack config helper
cp node_modules/react-native-electron-platform/src/webpackConfigHelper.mjs ./src/

# Copy preload script (for security)
cp node_modules/react-native-electron-platform/src/preload.mjs ./src/
```

### Option 3: As a Library (Advanced)

Use utility functions directly in your project:

```javascript
// Analyze dependencies
import webpackConfigHelper from 'react-native-electron-platform/src/webpackConfigHelper.mjs';
const packages = webpackConfigHelper.categorizePackages();

// Use modules
import { windowManager, networkService, autoUpdater } from 'react-native-electron-platform/src/modules/';

// Create window
windowManager.createWindow({ width: 1024, height: 768 });

// Make secure network requests
networkService.fetch('https://api.example.com/data');

// Check for updates
autoUpdater.checkForUpdates();
```

## Example Project

See the [example-project](example-project/) folder for a complete, working example with:
- Pre-configured `package.json`
- Sample App component
- Electron configuration
- HTML entry point

## 🔧 Available NPM Scripts

All scripts are configured to work with react-native-electron-platform.

### 📱 Mobile Development

| Script | Platform | Purpose |
|--------|----------|---------|
| `npm run android` | Android | Build and run on Android device/emulator |
| `npm run ios` | iOS | Build and run on iOS device/simulator |
| `npm start` | Both | Start React Native dev server |

### 🌐 Web Development

| Script | Purpose | Usage |
|--------|---------|-------|
| `npm run web` | Start webpack dev server | Development with hot reload on `http://localhost:5001` |
| `npm run web:build` | Production web bundle | Creates optimized bundle for deployment |

### 🖥️ Electron Development & Building

| Script | Purpose | When to Use |
|--------|---------|------------|
| `npm run electron` | Full dev environment | Main development - webpack + Electron with reload |
| `npm run electron:dev` | Quick test | Fast testing (requires pre-built web bundle) |
| `npm run electron:build` | Production build | Create installers for all Windows formats |
| `npm run electron:build:nsis` | NSIS installer | Build Windows NSIS installer (.exe) |
| `npm run electron:build:msi` | MSI installer | Build Windows MSI installer for enterprises |

### 📊 Code Quality

| Script | Purpose |
|--------|---------|
| `npm run lint` | Run ESLint to check code style |
| `npm test` | Run Jest test suite |

### Quick Development Workflow

```bash
# Start development
npm run electron              # Starts webpack + Electron automatically

# In another terminal, make your changes and save
# Your app will hot-reload automatically!

# When ready to build
npm run electron:build        # Creates production build

# Or build specific format for Windows
npm run electron:build:nsis   # NSIS installer
npm run electron:build:msi    # MSI installer (for enterprises)
```

### What Each Development Script Does

**`npm run electron`** - Recommended for development
```
1. Starts webpack dev server (http://localhost:5001)
2. Waits for server to be ready
3. Launches Electron window
4. Enables Hot Module Replacement (HMR)
5. Auto-reloads on file changes
```

**`npm run electron:dev`** - Quick Electron test
```
Requires you to:
1. Run npm run web:build first
2. Then start Electron directly
Faster startup, useful for quick testing of Electron-specific features
```

**`npm run web`** - Web browser testing
```
1. Starts webpack dev server on http://localhost:5001
2. Open in any browser
3. Great for testing without Electron
4. Faster reload times
```

## 🔌 API Reference

### WebpackConfigHelper

Utility functions for analyzing and configuring webpack builds:

```javascript
import webpackConfigHelper from 'node_modules/react-native-electron-platform/src/webpackConfigHelper.mjs';

// Get all dependencies from package.json
const allPackages = webpackConfigHelper.getAllPackages();

// Categorize packages by platform support
const { webSupported, webUnsupported } = webpackConfigHelper.categorizePackages();

// Check if a specific package supports web
if (webpackConfigHelper.isWebSupported('react-native-gesture-handler')) {
  console.log('This package works on web');
} else {
  console.log('This package requires native-only implementation');
}
```

### Available Modules

Import and use pre-configured modules in your app:

```javascript
import { 
  windowManager,
  networkService, 
  autoUpdater,
  deepLinking,
  safeMode,
  pdfHelper 
} from 'react-native-electron-platform/src/modules/';
```

#### 🪟 windowManager
Manages Electron windows and their lifecycle:

```javascript
import { windowManager } from 'react-native-electron-platform/src/modules/';

// Create a new window
windowManager.createWindow({
  width: 1024,
  height: 768,
  webPreferences: {
    nodeIntegration: false
  }
});

// Manage windows
windowManager.getWindows();
windowManager.closeWindow(id);
```

#### 🌐 networkService
Makes secure HTTP requests from the main process:

```javascript
import { networkService } from 'react-native-electron-platform/src/modules/';

// Fetch data securely
networkService.fetch('https://api.example.com/data', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer token' }
}).then(response => response.json());

// Post data
networkService.fetch('https://api.example.com/data', {
  method: 'POST',
  body: JSON.stringify({ name: 'John' })
});
```

#### 🔄 autoUpdater
Automatically check for and install app updates:

```javascript
import { autoUpdater } from 'react-native-electron-platform/src/modules/';

// Check for updates
autoUpdater.checkForUpdates();

// Listen for update events
autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version);
});

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded, will install on restart');
});
```

#### 🔗 deepLinking
Handle platform-specific deep links:

```javascript
import { deepLinking } from 'react-native-electron-platform/src/modules/';

// Set up deep link handler
deepLinking.onDeepLink((url) => {
  console.log('Deep link received:', url);
  // Navigate to correct screen
});
```

#### 🛡️ safeMode
Recovery utilities for safe startup:

```javascript
import { safeMode } from 'react-native-electron-platform/src/modules/';

// Enable safe mode for troubleshooting
safeMode.enable();

// Check if safe mode is active
if (safeMode.isEnabled()) {
  console.log('Running in safe mode');
}
```

#### 📄 pdfHelper
Generate and preview PDF documents:

```javascript
import { pdfHelper } from 'react-native-electron-platform/src/modules/';

// Generate PDF from content
pdfHelper.generate({
  content: '<h1>My PDF</h1>',
  outputPath: '/path/to/output.pdf'
});

// Preview PDF
pdfHelper.preview('/path/to/document.pdf');
```

### IPC Handlers

The platform provides pre-configured secure IPC communication for common tasks:

#### 📋 Clipboard Operations
```javascript
// In React Native component
import { ipcRenderer } from 'electron';

// Copy to clipboard
ipcRenderer.send('clipboard:write', 'text to copy');

// Read from clipboard
ipcRenderer.invoke('clipboard:read').then(text => {
  console.log('Clipboard content:', text);
});
```

#### 📁 File Operations
```javascript
// Read file
ipcRenderer.invoke('file:read', '/path/to/file').then(content => {
  console.log(content);
});

// Write file
ipcRenderer.invoke('file:write', '/path/to/file', 'content');

// Delete file
ipcRenderer.invoke('file:delete', '/path/to/file');
```

#### 💬 Dialog
```javascript
// Open file dialog
ipcRenderer.invoke('dialog:open').then(filePath => {
  console.log('Selected file:', filePath);
});

// Save file dialog
ipcRenderer.invoke('dialog:save', 'defaultFileName').then(filePath => {
  console.log('Save location:', filePath);
});

// Message box
ipcRenderer.invoke('dialog:message', {
  type: 'info',
  title: 'Information',
  message: 'This is a message'
});
```

#### 🌐 Network
```javascript
// Make network request through main process
ipcRenderer.invoke('network:request', {
  url: 'https://api.example.com',
  method: 'GET'
}).then(response => {
  console.log(response);
});
```

#### 📄 PDF
```javascript
// Generate PDF
ipcRenderer.invoke('pdf:generate', {
  content: '<h1>PDF Content</h1>',
  outputPath: '/output/file.pdf'
});

// Preview PDF
ipcRenderer.invoke('pdf:preview', '/path/to/file.pdf');
```

#### 🔄 Auto-Update
```javascript
// Check for updates
ipcRenderer.send('updater:check');

// Listen for update events
ipcRenderer.on('updater:available', (event, info) => {
  console.log('Update available:', info);
});

// Install update on next restart
ipcRenderer.send('updater:install');
```

## 🏗️ Building for Different Platforms

### Electron (Windows/macOS/Linux)

**Development:**
```bash
npm run electron
```
This launches an Electron window with hot reload enabled. Perfect for development.

**Production Build:**
```bash
# All formats
npm run electron:build

# Windows NSIS installer (recommended for users)
npm run electron:build:nsis

# Windows MSI installer (for enterprise deployments)
npm run electron:build:msi
```

Output files appear in the `dist/` directory:
- `.exe` - Executable installer
- `.zip` - Portable version
- `.msi` - Microsoft Installer format (for enterprises)

### Web (Browser)

**Development:**
```bash
npm run web
```
Starts webpack dev server on `http://localhost:5001` with hot reload.

**Production:**
```bash
npm run web:build
```
Creates optimized bundle in `dist/` folder. Deploy to any web server.

### Android

**Development:**
```bash
npm run android
```
Requires Android SDK and emulator or USB device.

**Production:**
```bash
npm run android -- --variant release
```

### iOS (macOS only)

**Development:**
```bash
npm run ios
```
Requires Xcode and iOS simulator or device.

**Production:**
```bash
npm run ios -- --configuration Release
```

### Multi-Platform Build

Build once for multiple platforms:
```bash
# Build web
npm run web:build

# Build Android
npm run android

# Build iOS
npm run ios

# Build Electron
npm run electron:build
```

## 🎯 Platform-Specific Code

### Using Platform Detection

```javascript
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web-only code
} else if (Platform.OS === 'electron') {
  // Electron-only code
} else if (Platform.OS === 'android') {
  // Android-only code
} else if (Platform.OS === 'ios') {
  // iOS-only code
}
```

### Platform-Specific Imports

Create files with platform extensions and React Native automatically uses the correct one:

```
components/
├── Button.js           # Shared base (fallback)
├── Button.web.js       # Used on web
├── Button.electron.js  # Used on Electron
├── Button.android.js   # Used on Android
└── Button.ios.js       # Used on iOS
```

Usage is the same:
```javascript
import Button from './Button';  // Automatically loads correct version!
```

### Conditional Imports

```javascript
import { Platform } from 'react-native';

let FileModule;
if (Platform.OS !== 'web') {
  // This import only happens on mobile/Electron
  FileModule = require('react-native-document-picker');
}

export default FileModule;
```

## ⚠️ Web-Unsupported Packages

Some React Native packages don't work on the web. The platform provides a list:

```javascript
import { WEB_UNSUPPORTED_PACKAGES } from './electron/nonmodules.mjs';
```

**Common unsupported packages:**
- `react-native-gesture-handler` - Use web alternatives
- `react-native-fs` - Use web APIs (File, Blob)
- `react-native-document-picker` - Use HTML file input
- `react-native-camera` - Use web `getUserMedia` API
- `react-native-video` - Use HTML `<video>` tag
- `@react-native-community/hooks` - Check web compatibility

**Solution: Use platform-specific code**

```javascript
import { Platform } from 'react-native';

let DocumentPicker;
if (Platform.OS !== 'web') {
  DocumentPicker = require('react-native-document-picker').default;
}

export function selectDocument() {
  if (Platform.OS === 'web') {
    // Use HTML file input
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
  } else {
    // Use native picker
    return DocumentPicker.pick();
  }
}
```

## 🏭 Building for Production

### Electron Production Build

```bash
# Complete production build
npm run electron:build

# Creates installers in dist/ folder
```

**What it does:**
1. Builds optimized web bundle (minified, no debug code)
2. Runs electron-builder to create installers
3. For each platform, creates appropriate format:
   - **Windows:** `.exe` + `.zip`
   - **macOS:** `.dmg` + `.zip`
   - **Linux:** `.AppImage` + `.deb`

**Custom Build Config** (optional `electron-builder.json`):
```json
{
  "productName": "My App",
  "appId": "com.example.myapp",
  "directories": {
    "buildResources": "./assets"
  },
  "win": {
    "target": ["nsis", "portable"]
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  },
  "mac": {
    "target": ["dmg", "zip"]
  },
  "linux": {
    "target": ["AppImage", "deb"]
  }
}
```

### Web Production Build

```bash
npm run web:build
```

**Deployment:**
```bash
# The dist/ folder is ready for any web server
npm install -g http-server
http-server dist/

# Or deploy to services like:
# Vercel: vercel
# Netlify: netlify deploy --prod --dir=dist
# AWS S3: aws s3 sync dist/ s3://my-bucket
```

### Mobile Production Build

**Android:**
```bash
npm run android -- --variant release
```

Generates signed APK in `android/app/build/outputs/`.

**iOS:**
```bash
npm run ios -- --configuration Release
```

Use App Store Connect for distribution.

## 🐛 Troubleshooting

### Electron Won't Start

**Problem:** Blank window or "Cannot find entry point"

**Solution:**
1. Ensure webpack is running: `npm run web`
2. Check webpack is ready on `http://localhost:5001`
3. Verify `index.html` exists in project root
4. Check logs in terminal for errors

### Port 5001 Already in Use

**Problem:** "Port 5001 already in use"

**Windows:**
```bash
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :5001
kill -9 <PID>
```

### Hot Reload Not Working

**Problem:** Changes don't appear when you save

**Solution:**
1. Verify webpack is running
2. Check file was actually saved
3. Hard refresh in Electron: `Ctrl+Shift+R`
4. Restart both webpack and Electron

### Module Not Found Errors

**Problem:** "Cannot find module 'react-native-electron-platform'"

**Solution:**
```bash
rm -rf node_modules
npm install
npm install react-native-electron-platform
```

### Build Fails with Errors

**Problem:** `npm run electron:build` fails

**Solution:**
1. Clear cache: `rm -rf dist`
2. Update packages: `npm update`
3. Check Node.js version: `node --version` (requires 14+)
4. Try clean install: `rm -rf node_modules && npm install`

### Blank Electron Window

**Problem:** Electron launches but window is blank

**Debug steps:**
1. Open DevTools: `Ctrl+Shift+I` in Electron
2. Check console for errors
3. Check Network tab - is webpack loading?
4. Verify `electron/index.js` is correct
5. Try `npm run web` to test in browser first

### Web App Not Loading

**Problem:** `http://localhost:5001` shows blank page

**Solution:**
1. Check webpack output in terminal for errors
2. Look for "Compiling..." status
3. Try hard refresh: `Ctrl+Shift+R`
4. Check if Babel is installed: `npm install @babel/core babel-loader`
5. Clear browser cache

### IPC Communication Not Working

**Problem:** "Cannot use ipcRenderer on web"

**Solution:** Use platform detection:
```javascript
import { Platform, View } from 'react-native';

let content;
if (Platform.OS === 'electron') {
  const { ipcRenderer } = require('electron');
  // Use IPC here
  ipcRenderer.invoke('some-action');
  content = <View>Electron</View>;
} else {
  // Use REST API or fetch
  fetch('/api/endpoint');
  content = <View>Web</View>;
}
```

### Performance Issues

**Slow Webpack Build:**
```bash
# Speed up dev mode
npm run web -- --mode development --devtool eval-source-map
```

**Large Bundle Size:**
```bash
# Analyze bundle
npm run web:build -- --profile

# Remove unused dependencies
npm prune --production
```

### Debug in DevTools

**Electron:**
1. Press `Ctrl+Shift+I` to open DevTools
2. Console shows messages from both processes
3. Use `console.log()` for debugging
4. DevTools React plugin available

**Web:**
1. Open browser DevTools: `F12`
2. Install React DevTools extension
3. Use Network tab to debug API calls

**Mobile:**
1. Android: `adb logcat` for Logcat
2. iOS: Open Xcode Console

## � Project Structure

### Recommended Structure

```
your-project/
├── src/
│   ├── screens/              # Screen components
│   │   ├── Home.js
│   │   ├── Settings.js
│   │   └── Details.js
│   ├── components/           # Reusable components
│   │   ├── Button.js
│   │   ├── Button.web.js
│   │   ├── Button.electron.js
│   │   ├── Header.js
│   │   └── Card.js
│   ├── utils/                # Utility functions
│   │   ├── api.js
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── hooks/                # Custom React hooks
│   │   ├── useData.js
│   │   └── useAuth.js
│   ├── App.js                # Root component
│   └── index.html            # Web entry point (webpack output)
│
├── electron/
│   ├── index.js              # Electron app initialization
│   ├── nonmodules.mjs        # List of web-unsupported packages
│   └── modules/              # Custom Electron modules (optional)
│       └── customModule.js
│
├── assets/                   # Images, icons, fonts
│   ├── icon.ico
│   ├── icon.png
│   └── logo.svg
│
├── __tests__/                # Test files
│   ├── App.test.js
│   └── components/
│
├── .gitignore
├── .env                      # Environment variables (git-ignored)
├── package.json
├── index.html                # Webpack HTML template
├── CONFIGURATION.md          # Config documentation
├── webpack.config.mjs        # (optional) Custom webpack config
├── electron-builder.json     # (optional) Custom build config
└── node_modules/
    └── react-native-electron-platform/  # This package
```

### Key Directories

- **src/** - All application source code
- **electron/** - Electron-specific code and configuration
- **assets/** - Static resources (images, icons, fonts)
- **__tests__/** - Test files (mirrors src structure)
- **node_modules/** - Dependencies including react-native-electron-platform

## 📚 Complete Documentation

Complete documentation to help you get started and understand how to use the platform:

### 🚀 Getting Started (Quick)
- **[SETUP.md](SETUP.md)** ⭐ **START HERE** - Step-by-step setup guide for new projects
- **[example-project/](example-project/)** - Ready-to-copy working example project
- **[USAGE.md](USAGE.md)** - Comprehensive usage guide with all scripts explained

### 📖 Reference & Details
- **[CONFIGURATION.md](CONFIGURATION.md)** - Detailed explanation of every config and script
- **[DOCS_GUIDE.md](DOCS_GUIDE.md)** - Documentation navigation, FAQ, and learning paths

### 🤝 Contributing & Community
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute to this project
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community guidelines and code of conduct
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and what changed between versions

## �📖 Documentation

```
your-project/
├── src/
│   ├── App.js                    # Main React Native component
│   └── index.html                # Web entry point
├── electron/
│   ├── index.js                  # Electron app initialization
│   └── nonmodules.mjs            # List of web-unsupported packages
├── index.html                    # Webpack HTML template
├── package.json                  # Project configuration
└── node_modules/
    └── react-native-electron-platform/  # Platform utilities
```

## Documentation

- **[Complete Setup Guide](SETUP.md)** - Step-by-step instructions for creating a new project
- **[Usage Documentation](USAGE.md)** - Detailed usage guide with all scripts and configuration
- **[Example Project](example-project/)** - Working example with pre-configured setup
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to this project
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community guidelines
- **[Changelog](CHANGELOG.md)** - Version history and changes

## 💡 Tips & Best Practices

### Development Tips

1. **Use `npm run electron` for main development** - It automatically manages webpack and Electron
2. **Test on web first** - `npm run web` is faster for quick iterations
3. **Use DevTools** - Press `Ctrl+Shift+I` in Electron for debugging
4. **Platform-specific files** - Use `.web.js`, `.electron.js` extensions for platform code
5. **Check web-unsupported packages** - Update `electron/nonmodules.mjs` when adding dependencies

### Production Tips

1. **Test production build locally first** - `npm run electron:build` creates dist/, test it
2. **Sign your code** - Use code signing for macOS/iOS builds
3. **Use NSIS for Windows** - Better user experience than portable executable
4. **Automate updates** - Use electron-updater for seamless updates
5. **Monitor bundle size** - Keep web bundle under 1MB for fast loads

### Performance Tips

1. **Code splitting** - Split large bundles for faster loads
2. **Lazy loading** - Load screens/components on demand
3. **Asset optimization** - Compress images and use appropriate formats
4. **Caching** - Configure proper cache headers for web servers
5. **Memory management** - Watch for memory leaks in DevTools

## 🔗 Integration Examples

### Connect to a Backend API

```javascript
// In your app
import { networkService } from 'react-native-electron-platform/src/modules/';

async function fetchUserData(userId) {
  const response = await networkService.fetch(`https://api.example.com/users/${userId}`);
  return response.json();
}
```

### Handle File Operations

```javascript
import { ipcRenderer } from 'electron';

// Read file
const content = await ipcRenderer.invoke('file:read', '/path/to/file');

// Write file
await ipcRenderer.invoke('file:write', '/path/to/file', 'content');

// Delete file
await ipcRenderer.invoke('file:delete', '/path/to/file');
```

### Generate PDF

```javascript
import { pdfHelper } from 'react-native-electron-platform/src/modules/';

// Generate from HTML
pdfHelper.generate({
  content: '<h1>Invoice</h1><p>Total: $100</p>',
  outputPath: '/path/to/invoice.pdf'
});

// Preview PDF
pdfHelper.preview('/path/to/document.pdf');
```

### Check for Updates

```javascript
import { autoUpdater } from 'react-native-electron-platform/src/modules/';

autoUpdater.checkForUpdates();

autoUpdater.on('update-available', (info) => {
  console.log('New version available:', info.version);
  // Notify user
});

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded, will install on restart');
  // User can restart app to install
});
```

## 📞 Getting Help

### Common Questions

**Q: Can I use this with existing React Native projects?**
A: Yes! Install the package and copy the configuration from example-project.

**Q: Does it work offline?**
A: Electron apps work offline. Web requires internet for initial load. Use service workers for offline web.

**Q: Can I add native modules?**
A: Yes for mobile (iOS/Android). Electron also supports native modules. Use platform detection.

**Q: How do I split code for different platforms?**
A: Use platform extensions (`.web.js`, `.electron.js`) or import guards.

**Q: Is it production-ready?**
A: Yes! Used in production by many organizations.

### Documentation Links

- **Getting Started:** [SETUP.md](SETUP.md)
- **All Commands:** [CONFIGURATION.md](CONFIGURATION.md)
- **Troubleshooting:** [USAGE.md#troubleshooting](USAGE.md#troubleshooting)
- **Example Code:** [example-project/](example-project/)

### Community

- **GitHub Issues:** https://github.com/dpraful/react-native-electron-platform/issues
- **GitHub Discussions:** https://github.com/dpraful/react-native-electron-platform/discussions

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## License

This project is proprietary software owned by JESCON TECHNOLOGIES PVT LTD. All rights reserved. Unauthorized use, copying, modification, or distribution is prohibited.
