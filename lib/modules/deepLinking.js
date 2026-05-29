import { BrowserWindow, ipcMain } from "electron";
const appOpenURLTargets = new WeakSet();
// Export deep linking handler names as constants
export const DEEP_LINKING_HANDLER_NAMES = {
    ADD_APP_OPEN_URL: 'react-native-add-app-open-url',
    GET_INITIAL_URL: 'react-native-get-initial-url',
    APP_OPEN_URL: 'react-native-app-open-url'
};
// Export deep linking utility functions
export function sendOpenURL(url) {
    for (const window of BrowserWindow.getAllWindows()) {
        if (appOpenURLTargets.has(window.webContents)) {
            window.webContents.send(DEEP_LINKING_HANDLER_NAMES.APP_OPEN_URL, url);
        }
    }
}
export function addAppOpenUrlTarget(event) {
    appOpenURLTargets.add(event.sender);
}
export function getInitialUrl() {
    return Promise.resolve(process.argv[1]);
}
export function registerDeepLinkingHandlers(sendOpenURLCallback) {
    ipcMain.handle(DEEP_LINKING_HANDLER_NAMES.ADD_APP_OPEN_URL, (event) => {
        addAppOpenUrlTarget(event);
    });
    ipcMain.handle(DEEP_LINKING_HANDLER_NAMES.GET_INITIAL_URL, () => {
        return getInitialUrl();
    });
}
