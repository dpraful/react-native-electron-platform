import { ipcMain, dialog } from "electron";
import fs from "fs";
import https from "https";
import http from "http";
import path from "path";

export function registerFileHandlers() {

  // ======================================================
  // SELECT FILE
  // ======================================================
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

  // ======================================================
  // UNIVERSAL FILE DOWNLOAD
  // ======================================================
  ipcMain.handle("download-file", async (_event, { url, filename }) => {
    try {

      const ext = path.extname(url) || "";

      const { filePath } = await dialog.showSaveDialog({
        title: "Save File",
        defaultPath: filename || `download${ext}`,
      });

      if (!filePath) {
        return {
          status: "cancelled",
        };
      }

      const protocol = url.startsWith("https") ? https : http;

      return new Promise((resolve, reject) => {

        const file = fs.createWriteStream(filePath);

        protocol.get(url, (response) => {

          response.pipe(file);

          file.on("finish", () => {

            file.close();

            resolve({
              status: "success",
              filePath: filePath,
            });

          });

        }).on("error", (err) => {

          console.error("download-file error:", err);

          reject({
            status: "error",
            message: err.message,
          });

        });

      });

    } catch (err) {

      console.error("download-file error:", err);

      return {
        status: "error",
        message: err.message,
      };

    }
  });

}