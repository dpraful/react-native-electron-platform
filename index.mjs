import { app, BrowserWindow } from "electron";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const packageJson = require("../../package.json");
// Import modules
import { shouldUseSafeMode, applySafeMode } from './lib/modules/safeMode.js';
import { registerDeepLinkingHandlers, sendOpenURL } from './lib/modules/deepLinking.js';
import { registerAllIpcHandlers } from './lib/modules/ipcHandlers/index.js';
import { setupAutoUpdater } from './lib/modules/autoUpdater.js';
import { createMainWindow } from './lib/modules/windowManager.js';
const color = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
};
const format = {
    info: (text) => `${color.blue}${text}${color.reset}`,
    success: (text) => `${color.green}${text}${color.reset}`,
    warn: (text) => `${color.yellow}${text}${color.reset}`,
    error: (text) => `${color.red}${text}${color.reset}`,
};
// ======================================================
// SAFE MODE DETECTION (applies before ready)
// ======================================================
if (shouldUseSafeMode()) {
    applySafeMode();
}
let mainWindow;
// ======================================================
// REGISTER IPC HANDLERS
// ======================================================
registerAllIpcHandlers();
registerDeepLinkingHandlers(sendOpenURL);
// ======================================================
// APP LIFECYCLE
// ======================================================
// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}
else {
    app.on('second-instance', (event, commandLine) => {
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
            // Handle deep link from second instance
            const url = commandLine.pop();
            if (url && (url.startsWith('myapp://') || url.startsWith('http'))) {
                sendOpenURL(url);
            }
        }
    });
}
app.whenReady().then(() => {
    if (process.platform === "win32") {
        app.setAppUserModelId(`com.${packageJson.name}.desktop`);
    }
    mainWindow = createMainWindow(__dirname);
    setupAutoUpdater(mainWindow);
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createMainWindow(__dirname);
    }
});
