import { ipcMain, clipboard } from "electron";
// Export clipboard handler names as constants
export const CLIPBOARD_HANDLER_NAMES = {
    GET: 'react-native-get-clipboard-text',
    SET: 'react-native-set-clipboard-text'
};
// Export clipboard utility functions
export async function getClipboardText() {
    return await clipboard.readText();
}
export async function setClipboardText(text) {
    await clipboard.writeText(text);
}
export function registerClipboardHandlers() {
    ipcMain.handle(CLIPBOARD_HANDLER_NAMES.GET, async () => {
        return await getClipboardText();
    });
    ipcMain.handle(CLIPBOARD_HANDLER_NAMES.SET, async (_event, text) => {
        await setClipboardText(text);
    });
}
