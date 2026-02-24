# react-native-electron-platform

[![npm version](https://badge.fury.io/js/react-native-electron-platform.svg)](https://badge.fury.io/js/react-native-electron-platform)
[![CI](https://github.com/dpraful/react-native-electron-platform/workflows/CI/badge.svg)](https://github.com/dpraful/react-native-electron-platform/actions)

A boilerplate and utility library for running React Native applications in Electron, supporting both desktop and web platforms.

## Features

- Electron main process setup with auto-updater
- Preload script for secure IPC communication
- Webpack configuration helper for React Native web builds
- Network service integration
- PDF generation and preview
- File selection dialogs
- HTML preview functionality

## Installation

```bash
npm install react-native-electron-platform
```

## Usage

### As a Boilerplate

1. Copy the `src/main.mjs` and `src/preload.js` to your Electron project.
2. Use the `src/webpackConfigHelper.mjs` to configure your webpack build for React Native web.

### As a Library

```javascript
import { categorizePackages, isWebSupported } from 'react-native-electron-platform';

const packages = categorizePackages();
// Use the categorized packages for your build configuration
```

### Running the Example

```bash
npm start
```

This will start the Electron app with the included example.

## API

### WebpackConfigHelper

- `getAllPackages()`: Get all dependencies from package.json
- `categorizePackages()`: Separate packages into web-supported and unsupported
- `isWebSupported(packageName)`: Check if a package supports web platform

## Building

```bash
npm run build
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## License

This project is proprietary software owned by JESCON TECHNOLOGIES PVT LTD. All rights reserved. Unauthorized use, copying, modification, or distribution is prohibited.
