import { ipcMain, clipboard } from "electron";

export function registerClipboardHandlers() {
  ipcMain.handle('react-native-get-clipboard-text', async () => {
    return await clipboard.readText();
  });

  ipcMain.handle('react-native-set-clipboard-text', async (_event, text) => {
    await clipboard.writeText(text);
  });
}