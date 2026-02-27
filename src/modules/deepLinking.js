import { BrowserWindow, ipcMain } from "electron";

const appOpenURLTargets = new WeakSet();

export function sendOpenURL(url) {
  for (const window of BrowserWindow.getAllWindows()) {
    if (appOpenURLTargets.has(window.webContents)) {
      window.webContents.send('react-native-app-open-url', url);
    }
  }
}

export function registerDeepLinkingHandlers(sendOpenURLCallback) {
  ipcMain.handle('react-native-add-app-open-url', (event) => {
    appOpenURLTargets.add(event.sender);
  });

  ipcMain.handle('react-native-get-initial-url', () => {
    return Promise.resolve(process.argv[1]);
  });
}