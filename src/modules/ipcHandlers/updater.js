import { ipcMain, app } from "electron";
import electronUpdater from "electron-updater";
const { autoUpdater } = electronUpdater;

export function registerUpdaterHandlers() {
  ipcMain.handle("check-for-updates", async () => {
    if (app.isPackaged) {
      autoUpdater.checkForUpdates();
      return { status: "checking" };
    }
    return { status: "disabled", message: "Auto-update disabled in development" };
  });

  ipcMain.handle("get-app-version", () => {
    return app.getVersion();
  });
}