import { ipcMain, shell } from "electron";
import { registerClipboardHandlers } from './clipboard.js';
import { registerDialogHandlers } from './dialog.js';
import { registerUpdaterHandlers } from './updater.js';
import { registerNetworkHandlers } from './network.js';
import { registerPdfHandlers } from './pdf.js';
import { registerFileHandlers } from './fileOps.js';
import { registerUtilsHandlers } from './utils.js';

export function registerAllIpcHandlers() {
  console.log("📝 Registering IPC handlers...");

  // Deep Linking (basic)
  ipcMain.handle('react-native-open-url', async (_event, url) => {
    await shell.openExternal(url);
  });

  // Register all category handlers
  registerClipboardHandlers();
  registerDialogHandlers();
  registerUpdaterHandlers();
  registerNetworkHandlers();
  registerPdfHandlers();
  registerFileHandlers();
  registerUtilsHandlers();

  // Internal support check
  ipcMain.on('react-native-supported', (event) => {
    event.returnValue = true;
  });

  console.log("✅ All IPC handlers registered");
}