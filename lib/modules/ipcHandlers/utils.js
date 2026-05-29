import { ipcMain, app } from "electron";
// Export utils handler names as constants
export const UTILS_HANDLER_NAMES = {
    GET_PLATFORM: 'get-platform',
    GET_APP_PATH: 'get-app-path',
    GET_USER_DATA_PATH: 'get-user-data-path'
};
// Export utils utility functions
export function getPlatform() {
    return process.platform;
}
export function getAppPath() {
    return app.getAppPath();
}
export function getUserDataPath() {
    return app.getPath("userData");
}
export function registerUtilsHandlers() {
    ipcMain.handle(UTILS_HANDLER_NAMES.GET_PLATFORM, () => {
        return getPlatform();
    });
    ipcMain.handle(UTILS_HANDLER_NAMES.GET_APP_PATH, () => {
        return getAppPath();
    });
    ipcMain.handle(UTILS_HANDLER_NAMES.GET_USER_DATA_PATH, () => {
        return getUserDataPath();
    });
}
