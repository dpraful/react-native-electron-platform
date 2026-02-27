import { ipcMain, app } from "electron";

export function registerUtilsHandlers() {
  ipcMain.handle("get-platform", () => {
    return process.platform;
  });

  ipcMain.handle("get-app-path", () => {
    return app.getAppPath();
  });

  ipcMain.handle("get-user-data-path", () => {
    return app.getPath("userData");
  });
}