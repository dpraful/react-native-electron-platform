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

# 2. Run
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
npm install react-native-web electron-updater
npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin @babel/core @babel/preset-react babel-loader terser-webpack-plugin @pmmmwh/react-refresh-webpack-plugin cross-env concurrently wait-on electron electron-builder compression-webpack-plugin
```

## 🚀 Quick Start Guide

**Step 1: Install Dependencies**
```bash
npm install
```

**Step 2: Run Your App**
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

### As an NPM Module (Recommended) ⭐

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
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "start": "react-native start",
    "test": "jest",
    "electron-platform:build": "npm --prefix node_modules/react-native-electron-platform run platform:build",
    "electron-platform:typecheck": "npm --prefix node_modules/react-native-electron-platform run platform:typecheck",
    "web": "npm --prefix node_modules/react-native-electron-platform run platform:web",
    "web:build": "npm --prefix node_modules/react-native-electron-platform run platform:web:build",
    "preelectron": "npm --prefix node_modules/react-native-electron-platform run platform:preelectron",
    "electron": "npm --prefix node_modules/react-native-electron-platform run platform:electron",
    "electron:dev": "npm --prefix node_modules/react-native-electron-platform run platform:electron:dev",
    "electron:build": "npm --prefix node_modules/react-native-electron-platform run platform:electron:build",
    "electron:build:nsis": "npm --prefix node_modules/react-native-electron-platform run platform:electron:build:nsis",
    "electron:build:msi": "npm --prefix node_modules/react-native-electron-platform run platform:electron:build:msi"
    "electron:build:mac": "npm --prefix node_modules/react-native-electron-platform run platform:electron:build:mac",
    "electron:build:mac:dmg": "npm --prefix node_modules/react-native-electron-platform run platform:electron:build:mac:dmg",
    "electron:build:mac:zip": "npm --prefix node_modules/react-native-electron-platform run platform:electron:build:mac:zip",
    "electron:build:linux": "npm --prefix node_modules/react-native-electron-platform run platform:electron:build:linux",
    "electron:build:linux:appimage": "npm --prefix node_modules/react-native-electron-platform run platform:electron:build:linux:appimage",
    "electron:build:linux:deb": "npm --prefix node_modules/react-native-electron-platform run platform:electron:build:linux:deb",
    "electron:build:linux:rpm": "npm --prefix node_modules/react-native-electron-platform run platform:electron:build:linux:rpm"
  },
}
```

Create `lib/App.js`:
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

**Run Your App:**
```bash
npm run electron
```

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

**Development:**

| Script | Purpose | When to Use |
|--------|---------|------------|
| `npm run electron` | Full dev environment | Main development - webpack + Electron with reload |
| `npm run electron:dev` | Quick test | Fast testing (requires pre-built web bundle) |

**Production Builds - Windows:**

| Script | Purpose | Output |
|--------|---------|--------|
| `npm run electron:build` | All Windows formats | `.exe` + `.msi` + `.zip` |
| `npm run electron:build:nsis` | NSIS installer | `.exe` (recommended for users) |
| `npm run electron:build:msi` | MSI installer | `.msi` (for enterprise deployments) |

**Production Builds - macOS:**

| Script | Purpose | Output |
|--------|---------|--------|
| `npm run electron:build:mac` | All macOS formats | `.dmg` + `.zip` (x64 & arm64) |
| `npm run electron:build:mac:dmg` | DMG installer | `.dmg` (recommended for users) |
| `npm run electron:build:mac:zip` | ZIP archive | `.zip` (portable) |

**Production Builds - Linux:**

| Script | Purpose | Output |
|--------|---------|--------|
| `npm run electron:build:linux` | All Linux formats | `.AppImage` + `.deb` + `.rpm` |
| `npm run electron:build:linux:appimage` | AppImage bundle | `.AppImage` (portable) |
| `npm run electron:build:linux:deb` | Debian package | `.deb` (Ubuntu/Debian systems) |
| `npm run electron:build:linux:rpm` | RPM package | `.rpm` (Red Hat/Fedora systems) |

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

## 🔌 Complete API Reference

### electronAPI - Global API

The `window.electronAPI` object is exposed in the renderer process with all available methods and listeners.

```javascript
// Access from any component
const { electronAPI } = window;
```

### 📋 Clipboard Operations

```javascript
// Get text from clipboard
const text = await electronAPI.getClipboardText();

// Set text to clipboard
await electronAPI.setClipboardText('text to copy');
```

### 💬 Dialog Operations

```javascript
// Show alert dialog
const response = await electronAPI.showAlert({
  title: 'Confirm Action',
  message: 'Are you sure?',
  buttons: ['Cancel', 'OK']
});
// response: 0 for 'Cancel', 1 for 'OK'
```

### 📁 File Operations

```javascript
// Open file selection dialog
const result = await electronAPI.selectFile();
// Returns: { status: 'selected', filePath: '/path/to/file' }

// Download file from URL
const downloadResult = await electronAPI.downloadFile(
  'https://example.com/file.pdf',
  'myfile.pdf'
);
// Returns: { status: 'success', filePath: '/path/to/downloaded/file' }
```

### 🌐 Network Operations

```javascript
// Make HTTP request through main process (bypasses CORS)
const response = await electronAPI.networkCall(
  'GET',
  'https://api.example.com/data',
  {}, // params
  { 'Authorization': 'Bearer token' } // headers
);

// POST request with data
const postResponse = await electronAPI.networkCall(
  'POST',
  'https://api.example.com/users',
  { name: 'John', email: 'john@example.com' },
  { 'Content-Type': 'application/json' }
);
```

### 📄 PDF Operations

```javascript
// Save HTML as PDF
const saveResult = await electronAPI.savePDF(
  '<h1>Invoice</h1><p>Total: $100</p>'
);
// Opens save dialog, user chooses location

// Preview HTML content
const previewResult = await electronAPI.previewHTML(
  '<h1>Document</h1><p>Content</p>'
);

// Convert HTML to PDF and preview
const pdfPreview = await electronAPI.htmlToPdfPreview(
  '<h1>Report</h1><p>Generated report content</p>'
);

// POST PDF preview (send to backend and preview response)
const postPdfResult = await electronAPI.postPdfPreview({
  url: 'https://api.example.com/generate-pdf',
  data: { reportId: '123' },
  headers: { 'Authorization': 'Bearer token' }
});
```

### 🔗 Deep Linking / URL Handling

```javascript
// Get the URL that opened the app
const initialUrl = await electronAPI.getInitialURL();

// Open URL in default browser
await electronAPI.openURL('https://example.com');

// Listen for deep link events
const cleanup = electronAPI.appOpenURL.addListener((url) => {
  console.log('App opened with URL:', url);
  // Navigate to appropriate screen based on URL
});

// Remove listener when component unmounts
// cleanup();
```

### 🔄 Auto-Update Operations

```javascript
// Listen for update status changes
const cleanup = electronAPI.onUpdateStatus((status) => {
  console.log('Update status:', status);
  // status can be:
  // { status: 'checking' }
  // { status: 'available', version: '1.2.0' }
  // { status: 'not-available' }
  // { status: 'downloading', percent: 45 }
  // { status: 'downloaded' }
  // { status: 'error', message: 'error details' }
});

// Manually check for updates
const updateStatus = await electronAPI.checkForUpdates();

// Get current app version
const version = await electronAPI.getAppVersion();
// Example: 'v1.2.0'
```

### 🛠️ Utility Functions

```javascript
// Generic event listener with cleanup
const cleanup = electronAPI.on('custom-channel', (data) => {
  console.log('Received:', data);
});

// Remove listener
// cleanup();

// Remove specific listener
electronAPI.removeListener('custom-channel', handlerFunction);

// Access platform information
console.log(electronAPI.platform); // 'win32', 'darwin', 'linux'
```

### 🔌 IPC Handlers

The platform provides pre-configured secure IPC communication for common tasks:

#### 📋 Clipboard Handlers
```javascript
// Channel names (for reference)
// 'react-native-get-clipboard-text' - get clipboard content
// 'react-native-set-clipboard-text' - set clipboard content
```

#### 📁 File Operations Handlers
```javascript
// Channel names
// 'select-file' - open file selection dialog
// 'download-file' - download file from URL
```

#### 💬 Dialog Handlers
```javascript
// Channel names
// 'react-native-show-alert' - show message box
```

#### 🌐 Network Handlers
```javascript
// Channel names
// 'network-call' - make HTTP request through main process
```

#### 📄 PDF Handlers
```javascript
// Channel names
// 'save-pdf' - save HTML as PDF file
// 'post-pdf-preview' - POST to backend and preview PDF response
// 'open-pdf-preview' - open PDF file for preview
// 'preview-html' - preview HTML content
// 'html-to-pdf-preview' - convert HTML to PDF and preview
```

#### 🔄 Auto-Update Handlers
```javascript
// Channel names
// 'check-for-updates' - manually check for app updates
// 'get-app-version' - get current app version
// 'update-status' - listen for update status changes (listener)
```

#### 🔗 Deep Linking Handlers
```javascript
// Channel names
// 'react-native-add-app-open-url' - register for deep link events
// 'react-native-get-initial-url' - get initial URL from command line
// 'react-native-app-open-url' - receive deep link events (listener)
// 'react-native-open-url' - open URL in external browser
```

#### 🛠️ Utility Handlers
```javascript
// Channel names
// 'get-platform' - get current platform (win32, darwin, linux)
// 'get-app-path' - get application directory path
// 'get-user-data-path' - get user data directory path
// 'react-native-supported' - check if running on Electron
```

## 🏗️ Building for Different Platforms

### Electron (Windows/macOS/Linux)

**Development:**
```bash
npm run electron
```
This launches an Electron window with hot reload enabled. Perfect for development.

**Production Build - Windows:**
```bash
# All formats (NSIS installer + MSI + portable ZIP)
npm run electron:build

# Windows NSIS installer (recommended - creates .exe with installer wizard)
npm run electron:build:nsis

# Windows MSI installer (for enterprise deployments with Group Policy support)
npm run electron:build:msi
```

Output files appear in the `dist/` directory:
- `.exe` - Executable NSIS installer (user-friendly setup wizard)
- `.msi` - Microsoft Installer format (enterprise, Group Policy compatible)
- `.zip` - Portable version (no installation required)

**Production Build - macOS:**
```bash
# All formats (DMG installer + portable ZIP, both x64 & arm64)
npm run electron:build:mac

# macOS DMG installer (recommended - drag-and-drop installation)
npm run electron:build:mac:dmg

# Portable ZIP archive (universal binary for Intel & Apple Silicon)
npm run electron:build:mac:zip
```

Output files appear in the `dist/` directory:
- `.dmg` - Disk image installer (native macOS experience)
- `.zip` - Universal app bundle (works on both x64 and arm64 Macs)

**Production Build - Linux:**
```bash
# All formats (AppImage, DEB package, RPM package)
npm run electron:build:linux

# AppImage (portable, works on most Linux distributions)
npm run electron:build:linux:appimage

# DEB package (for Ubuntu, Debian, Linux Mint)
npm run electron:build:linux:deb

# RPM package (for Fedora, Red Hat, CentOS)
npm run electron:build:linux:rpm
```

Output files appear in the `dist/` directory:
- `.AppImage` - Portable executable (no dependencies, works on most distros)
- `.deb` - Debian package (installs to system, auto-updates via package manager)
- `.rpm` - Red Hat package (for Red Hat-based systems)

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

# Or build for specific platforms:
npm run electron:build:mac
npm run electron:build:linux
```

## 💻 React Component Usage Examples

### Example 1: Using Clipboard in a Component

```javascript
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const ClipboardExample = () => {
  const [clipboardText, setClipboardText] = useState('');

  const copyToClipboard = async () => {
    await window.electronAPI.setClipboardText('Hello, Clipboard!');
    setClipboardText('Copied!');
  };

  const readFromClipboard = async () => {
    const text = await window.electronAPI.getClipboardText();
    setClipboardText(text);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={copyToClipboard}>
        <Text>Copy to Clipboard</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={readFromClipboard}>
        <Text>Read from Clipboard</Text>
      </Pressable>
      <Text>{clipboardText}</Text>
    </View>
  );
};

export default ClipboardExample;
```

### Example 2: File Download with Progress

```javascript
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const FileDownloadExample = () => {
  const [status, setStatus] = useState('');

  const downloadFile = async () => {
    try {
      setStatus('Downloading...');
      const result = await window.electronAPI.downloadFile(
        'https://example.com/document.pdf',
        'my-document.pdf'
      );
      
      if (result.status === 'success') {
        setStatus(`Downloaded to: ${result.filePath}`);
      } else {
        setStatus('Download cancelled');
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={downloadFile}>
        <Text>Download PDF</Text>
      </Pressable>
      <Text>{status}</Text>
    </View>
  );
};

export default FileDownloadExample;
```

### Example 3: PDF Generation from HTML

```javascript
import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';

const PdfGeneratorExample = () => {
  const [htmlContent, setHtmlContent] = useState('<h1>Invoice</h1><p>Amount: $100</p>');
  const [message, setMessage] = useState('');

  const generatePDF = async () => {
    try {
      const result = await window.electronAPI.savePDF(htmlContent);
      if (result.status === 'saved') {
        setMessage(`PDF saved to: ${result.path}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter HTML content"
        value={htmlContent}
        onChangeText={setHtmlContent}
        multiline
      />
      <Pressable style={styles.button} onPress={generatePDF}>
        <Text>Generate & Save PDF</Text>
      </Pressable>
      <Text>{message}</Text>
    </View>
  );
};

export default PdfGeneratorExample;
```

### Example 4: API Calls with Network Handler

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ApiCallExample = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await window.electronAPI.networkCall(
          'GET',
          'https://jsonplaceholder.typicode.com/todos/1',
          {},
          { 'Accept': 'application/json' }
        );
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>API Response:</Text>
      <Text>{JSON.stringify(data, null, 2)}</Text>
    </ScrollView>
  );
};

export default ApiCallExample;
```

### Example 5: Deep Linking Handler

```javascript
import React, { useEffect } from 'react';
import { View, Text, useNavigation } from 'react-native';

const DeepLinkHandler = ({ navigation }) => {
  useEffect(() => {
    // Get initial URL that opened the app
    const handleInitialUrl = async () => {
      const initialUrl = await window.electronAPI.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    // Listen for deep links
    const cleanup = window.electronAPI.appOpenURL.addListener((url) => {
      handleDeepLink(url);
    });

    handleInitialUrl();

    return cleanup;
  }, [navigation]);

  const handleDeepLink = (url) => {
    if (url.includes('profile')) {
      navigation.navigate('Profile');
    } else if (url.includes('settings')) {
      navigation.navigate('Settings');
    }
  };

  return <View />;
};

export default DeepLinkHandler;
```

### Example 6: Auto-Update Listener

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const UpdateNotifier = () => {
  const [updateStatus, setUpdateStatus] = useState(null);
  const [version, setVersion] = useState('');

  useEffect(() => {
    // Get current version
    window.electronAPI.getAppVersion().then(setVersion);

    // Listen for update status changes
    const cleanup = window.electronAPI.onUpdateStatus((status) => {
      setUpdateStatus(status);
      console.log('Update status:', status);
    });

    return cleanup;
  }, []);

  return (
    <View style={styles.container}>
      <Text>Current Version: {version}</Text>
      {updateStatus && (
        <>
          <Text>Status: {updateStatus.status}</Text>
          {updateStatus.version && <Text>Version: {updateStatus.version}</Text>}
          {updateStatus.percent && <Text>Progress: {updateStatus.percent}%</Text>}
          {updateStatus.message && <Text>Message: {updateStatus.message}</Text>}
        </>
      )}
    </View>
  );
};

export default UpdateNotifier;
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

## � Debugging & Development Tools

### Electron DevTools

**Open DevTools:**
- Press `Ctrl+Shift+I` (Windows/Linux)
- Press `Cmd+Option+I` (macOS)
- Or right-click → Inspect Element

**DevTools Tabs:**
- **Console** - View logs and errors
- **Elements** - Inspect HTML/CSS
- **Network** - Monitor API calls and network activity
- **Performance** - Profile app performance
- **Memory** - Detect memory leaks
- **Application** - View storage (localStorage, sessionStorage)

**Tips:**
- Enable "Pause on exceptions" to catch errors
- Use Performance tab to profile slow operations
- Check Memory tab for memory leaks
- Refresh with `Ctrl+Shift+R` (hard refresh)

### Browser DevTools (Web Mode)

```bash
npm run web
```

Then open `http://localhost:5001` and press `F12` to open browser DevTools.

### VS Code Debugger Integration

Add this to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Electron",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/electron",
      "args": ["${workspaceFolder}"],
      "restart": true,
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### Logging Best Practices

```javascript
// In your app
const log = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${message}`, data || '');
  }
};

// Use it
log('Fetching data from API', { url: 'https://api.example.com' });

// For errors
const logError = (message, error) => {
  console.error(`[ERROR] ${message}`, error);
  // In production, send to error tracking service
  if (process.env.REACT_APP_ENABLE_ERROR_TRACKING === 'true') {
    trackError(message, error);
  }
};
```

### Common Debugging Scenarios

**Debugging IPC Communication:**
```javascript
// Add debugging to IPC calls
const originalNetworkCall = window.electronAPI.networkCall;
window.electronAPI.networkCall = async (...args) => {
  console.log('[IPC] networkCall called with:', args);
  const result = await originalNetworkCall(...args);
  console.log('[IPC] networkCall result:', result);
  return result;
};
```

**Debugging Network Issues:**
```javascript
// Log all network calls
window.electronAPI.networkCall = async (method, url, params, headers) => {
  console.group(`📡 ${method} ${url}`);
  console.log('Params:', params);
  console.log('Headers:', headers);
  console.groupEnd();
  
  const result = await window.electronAPI.networkCall(method, url, params, headers);
  
  console.group(`✅ Response`);
  console.log(result);
  console.groupEnd();
  
  return result;
};
```

## �🐛 Troubleshooting

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
├── lib/
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

- **lib/** - All application source code
- **electron/** - Electron-specific code and configuration
- **assets/** - Static resources (images, icons, fonts)
- **__tests__/** - Test files (mirrors lib structure)
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
├── lib/
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

## ⚙️ Environment Configuration

### Development Environment Variables

Create a `.env` file in your project root:

```bash
# Port for webpack dev server
PORT=5001
HOST=localhost

# Node environment
NODE_ENV=development

# API endpoint for network calls
REACT_APP_API_URL=http://localhost:3000

# Feature flags
REACT_APP_ENABLE_UPDATES=false
REACT_APP_LOG_LEVEL=debug
```

### Accessing Environment Variables in Your App

```javascript
// In your React component
const apiUrl = process.env.REACT_APP_API_URL || 'https://api.example.com';
const enableUpdates = process.env.REACT_APP_ENABLE_UPDATES === 'true';

// Make API call
const response = await window.electronAPI.networkCall(
  'GET',
  `${apiUrl}/users`,
  {},
  { 'Authorization': 'Bearer token' }
);
```

### Production Configuration

For production builds, update your `.env.production`:

```bash
PORT=5001
HOST=localhost
NODE_ENV=production
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENABLE_UPDATES=true
REACT_APP_LOG_LEVEL=warn
```

## 🔒 Security Best Practices

### 1. Never Expose Secrets to Renderer

❌ **Don't do this:**
```javascript
// INSECURE - Secret exposed in client bundle
const API_KEY = 'sk-1234567890abcdef';
```

✅ **Do this:**
```javascript
// Make API call through main process
const response = await window.electronAPI.networkCall(
  'POST',
  '/api/endpoint',
  { data: 'value' },
  { 'Authorization': 'Bearer token-from-secure-storage' }
);
```

### 2. Validate All User Input

```javascript
// Before making network call
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return email;
}

const email = validateEmail(userInput);
const result = await window.electronAPI.networkCall(
  'POST',
  '/api/subscribe',
  { email }
);
```

### 3. Use Content Security Policy

The platform sets reasonable security defaults, but you can enhance them by updating `electron/index.js`:

```javascript
// Add CSP headers
mainWindow.webContents.session.webRequest.onHeadersReceived(
  (details, callback) => {
    const responseHeaders = {
      ...details.responseHeaders,
      'Content-Security-Policy': [
        "default-lib 'self'",
        "script-lib 'self' 'unsafe-inline'",
        "style-lib 'self' 'unsafe-inline'",
        "img-lib 'self' data: https:",
      ].join('; '),
    };
    callback({ responseHeaders });
  }
);
```

### 4. Keep Dependencies Updated

```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update packages regularly
npm update
```

### 5. Sign Code for Production

```bash
# For Windows (requires code signing certificate)
npm run electron:build:nsis -- --certificateFile=path/to/cert.pfx

# For macOS (requires Apple Developer account)
npm run electron:build:mac -- --identity="Developer ID Application"
```

## 🎯 Best Practices

## 🎯 Best Practices

### Development Tips

1. **Use `npm run electron` for main development** - It automatically manages webpack and Electron
2. **Test on web first** - `npm run web` is faster for quick iterations
3. **Use DevTools** - Press `Ctrl+Shift+I` in Electron for debugging
4. **Platform-specific files** - Use `.web.js`, `.electron.js` extensions for platform code
5. **Check web-unsupported packages** - Update `electron/nonmodules.mjs` when adding dependencies
6. **Use error boundaries** - Catch and handle errors gracefully in your components
7. **Implement loading states** - Show loading indicators during async operations
8. **Handle network timeouts** - Wrap API calls with timeout logic

### Production Tips

1. **Test production build locally first** - `npm run electron:build` creates dist/, test it
2. **Code signing** - Sign your code for macOS/iOS builds (security and trust)
3. **Use NSIS for Windows** - Better user experience than portable executable
4. **Use DMG for macOS** - Native installation experience
5. **Automate updates** - Use electron-updater for seamless updates
6. **Monitor bundle size** - Keep web bundle under 1MB for fast loads
7. **Implement error reporting** - Log errors to a service for monitoring
8. **Test on target platforms** - Build and test on Windows, macOS, and Linux before release

### Performance Tips

1. **Code splitting** - Split large bundles for faster loads
2. **Lazy loading** - Load screens/components on demand
3. **Asset optimization** - Compress images and use appropriate formats
4. **Caching** - Configure proper cache headers for web servers
5. **Memory management** - Watch for memory leaks in DevTools
6. **Debounce/Throttle** - Debounce expensive operations (network calls, searches)
7. **Image optimization** - Use WebP format when possible, compress PNG/JPEG
8. **Minimize re-renders** - Use React.memo for expensive components

### API Integration Tips

1. **Handle all error cases** - Network calls can fail, always have error handling
2. **Add retry logic** - Implement exponential backoff for failed requests
3. **Use abort signals** - Cancel requests if component unmounts
4. **Cache responses** - Store API responses to reduce network calls
5. **Rate limiting** - Respect API rate limits, implement backoff
6. **Batch requests** - Combine multiple API calls when possible
7. **Add request timeouts** - Prevent hanging requests from blocking the app

### Cross-Platform Tips

1. **Test on all platforms** - Windows, macOS, Linux have subtle differences
2. **Use platform detection** - Use `Platform.OS` to handle platform-specific code
3. **File path handling** - Use `path.join()` for cross-platform paths
4. **Line endings** - Use `.gitattributes` to handle line ending differences
5. **Case sensitivity** - macOS/Linux are case-sensitive, Windows is not
6. **Process spawning** - Use `child_process` with shell option for Windows compatibility

## 🔗 Integration Examples

### Connect to a Backend API

```javascript
// In your app
import { networkService } from 'react-native-electron-platform';

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
import { pdfHelper } from 'react-native-electron-platform';

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
import { autoUpdater } from 'react-native-electron-platform';

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

## � Continuous Integration & Deployment

### GitHub Actions Example

Create `.github/workflows/build.yml`:

```yaml
name: Build & Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build TypeScript
        run: npm run build:ts

      - name: Build Electron
        run: npm run electron:build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: dist/

      - name: Create Release
        if: startsWith(github.ref, 'refs/tags/')
        uses: ncipollo/release-action@v1
        with:
          artifacts: "dist/*"
          token: ${{ secrets.GITHUB_TOKEN }}
```

### Publishing Updates

Update your `electron-builder.json`:

```json
{
  "publish": [
    {
      "provider": "github",
      "owner": "YOUR_USERNAME",
      "repo": "YOUR_REPO",
      "releaseType": "release"
    }
  ]
}
```

Then builds will automatically check for updates and notify users.

## 📊 Project Structure Best Practices

```
your-project/
├── lib/
│   ├── screens/                  # Screen components (full page)
│   │   ├── HomeScreen.js
│   │   ├── ProfileScreen.js
│   │   └── SettingsScreen.js
│   ├── components/               # Reusable components
│   │   ├── Button/
│   │   │   ├── Button.js
│   │   │   ├── Button.web.js
│   │   │   └── Button.styles.js
│   │   ├── Card/
│   │   ├── Header/
│   │   └── Modal/
│   ├── hooks/                    # Custom React hooks
│   │   ├── useApi.js
│   │   ├── useAuth.js
│   │   └── usePlatform.js
│   ├── utils/                    # Utility functions
│   │   ├── api.js                # API helpers
│   │   ├── storage.js            # Storage helpers
│   │   ├── validation.js         # Input validation
│   │   └── platform.js           # Platform detection
│   ├── services/                 # Business logic services
│   │   ├── authService.js
│   │   ├── userService.js
│   │   └── dataService.js
│   ├── constants/                # Constants and config
│   │   ├── colors.js
│   │   ├── routes.js
│   │   └── config.js
│   ├── App.js                    # Root component
│   └── index.html                # Web entry point
│
├── electron/
│   ├── index.js                  # Electron app entry
│   ├── preload.js                # Preload script
│   ├── nonmodules.mjs            # Web-unsupported packages
│   └── utils/                    # Electron utilities (optional)
│       └── autoUpdater.js
│
├── assets/
│   ├── icons/
│   │   ├── icon.ico              # Windows
│   │   ├── icon.icns             # macOS
│   │   └── icon.png              # Linux
│   ├── images/
│   └── fonts/
│
├── __tests__/                    # Tests (mirrors lib structure)
│   ├── components/
│   ├── screens/
│   ├── utils/
│   └── setup.js
│
├── .github/
│   └── workflows/
│       └── build.yml             # CI/CD workflow
│
├── .gitignore
├── .env.example                  # Example env variables
├── package.json
├── tsconfig.json
├── webpack.config.mjs
├── electron-builder.json
└── node_modules/
```

## 📞 Support & Resources

### Documentation Files

- **[SETUP.md](SETUP.md)** - Step-by-step setup for new projects
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community guidelines

### External Resources

- **Electron Docs:** https://www.electronjs.org/docs
- **React Native Docs:** https://reactnative.dev
- **electron-builder:** https://www.electron.build
- **electron-updater:** https://www.npmjs.com/package/electron-updater

### Getting Help

- **GitHub Issues:** https://github.com/dpraful/react-native-electron-platform/issues
- **GitHub Discussions:** https://github.com/dpraful/react-native-electron-platform/discussions
- **Stack Overflow:** Tag questions with `electron` and `react-native`

## 📄 License

This project is proprietary software owned by JESCON TECHNOLOGIES PVT LTD. All rights reserved. Unauthorized use, copying, modification, or distribution is prohibited. See [LICENSE](LICENSE) for details.
