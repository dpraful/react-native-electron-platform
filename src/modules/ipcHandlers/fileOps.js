import { ipcMain, dialog } from "electron";

export function registerFileHandlers() {
  ipcMain.handle("select-file", async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: "Select a file",
        properties: ["openFile"],
        filters: [
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (result.canceled) {
        return {
          status: "cancelled",
          filePath: null,
        };
      }

      return {
        status: "selected",
        filePath: result.filePaths[0],
      };
    } catch (err) {
      console.error("select-file error:", err);
      return {
        status: "error",
        message: err.message,
      };
    }
  });
}