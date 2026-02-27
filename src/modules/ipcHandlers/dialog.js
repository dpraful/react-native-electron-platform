import { ipcMain, dialog, BrowserWindow } from "electron";

export function registerDialogHandlers() {
  ipcMain.handle('react-native-show-alert', async (event, options) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window != null) {
      const { response } = await dialog.showMessageBox(window, options);
      return response;
    }
  });
}