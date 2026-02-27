import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import packageJson from "../../package.json" with { type: 'json' };

// Import modules
import { shouldUseSafeMode, applySafeMode } from './src/modules/safeMode.js';
import { registerDeepLinkingHandlers, sendOpenURL } from './src/modules/deepLinking.js';
import { registerAllIpcHandlers } from './src/modules/ipcHandlers/index.js';
import { setupAutoUpdater } from './src/modules/autoUpdater.js';
import { createMainWindow } from './src/modules/windowManager.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
} else {
  app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
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
  
  // Log registered handlers
  console.log("📊 IPC Handlers registered:", 
    ipcMain.eventNames().filter(name => 
      typeof name === 'string' && 
      !name.startsWith('ELECTRON_')
    )
  );
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

// Export webpack helper utilities
export * from './src/webpackConfigHelper.mjs';