import { ipcMain, app } from "electron";
import electronUpdater from "electron-updater";
const { autoUpdater } = electronUpdater;
// Export updater handler names as constants
export const UPDATER_HANDLER_NAMES = {
    CHECK_FOR_UPDATES: 'check-for-updates',
    GET_APP_VERSION: 'get-app-version'
};
// Export updater utility functions
export async function checkForUpdates() {
    if (app.isPackaged) {
        autoUpdater.checkForUpdates();
        return { status: "checking" };
    }
    return { status: "disabled", message: "Auto-update disabled in development" };
}
export function getAppVersion() {
    return app.getVersion();
}
export function registerUpdaterHandlers() {
    ipcMain.handle(UPDATER_HANDLER_NAMES.CHECK_FOR_UPDATES, async () => {
        return await checkForUpdates();
    });
    ipcMain.handle(UPDATER_HANDLER_NAMES.GET_APP_VERSION, () => {
        return getAppVersion();
    });
}
