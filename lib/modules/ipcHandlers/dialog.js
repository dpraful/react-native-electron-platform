import { ipcMain, dialog, BrowserWindow } from "electron";
// Export dialog handler names as constants
export const DIALOG_HANDLER_NAMES = {
    SHOW_ALERT: 'react-native-show-alert'
};
// Export dialog utility functions
export async function showAlert(window, options) {
    if (window != null) {
        const { response } = await dialog.showMessageBox(window, options);
        return response;
    }
}
export function registerDialogHandlers() {
    ipcMain.handle(DIALOG_HANDLER_NAMES.SHOW_ALERT, async (event, options) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        return await showAlert(window, options);
    });
}
