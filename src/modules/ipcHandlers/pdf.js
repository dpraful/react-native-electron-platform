import { ipcMain, dialog, BrowserWindow } from "electron";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { app } from "electron";
import { convertHtmlToPdfPreview } from '../pdfHelper.js';

export function registerPdfHandlers() {
  ipcMain.handle("save-pdf", async (event, html) => {
    try {
      console.log("IPC save-pdf called");
      const tempWin = new BrowserWindow({
        show: false,
        webPreferences: { offscreen: true },
      });

      await tempWin.loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
      );

      const pdfBuffer = await tempWin.webContents.printToPDF({});
      tempWin.destroy();

      const { filePath } = await dialog.showSaveDialog({
        title: "Save PDF",
        defaultPath: "document.pdf",
        filters: [{ name: "PDF", extensions: ["pdf"] }],
      });

      if (filePath) {
        fs.writeFileSync(filePath, pdfBuffer);
        console.log("PDF saved:", filePath);
        return { status: "saved", path: filePath };
      }

      return { status: "cancelled" };
    } catch (err) {
      console.error("IPC save-pdf error:", err);
      return { status: "error", message: err.message };
    }
  });

  ipcMain.handle("post-pdf-preview", async (event, payload) => {
    try {
      const { url, data, headers = {} } = payload;
      console.log("IPC post-pdf-preview:", { url });
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          ...headers,
        },
        body: data,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const fileName = `Report_${Date.now()}.pdf`;
      const tempPath = path.join(app.getPath("temp"), fileName);

      const nodeStream = Readable.fromWeb(res.body);
      await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(tempPath);
        nodeStream.pipe(fileStream);
        nodeStream.on("error", reject);
        fileStream.on("finish", resolve);
      });

      return {
        status: "ok",
        path: `file://${tempPath}`,
      };
    } catch (err) {
      console.error("post-pdf-preview error:", err);
      return {
        status: "error",
        message: err.message,
      };
    }
  });

  ipcMain.handle("open-pdf-preview", async (_, pdfUrl) => {
    try {
      const res = await fetch(pdfUrl);
      const buffer = Buffer.from(await res.arrayBuffer());

      const tempPath = path.join(app.getPath("temp"), `preview_${Date.now()}.pdf`);
      fs.writeFileSync(tempPath, buffer);

      return `file://${tempPath}`;
    } catch (err) {
      console.error("open-pdf-preview error:", err);
      throw err;
    }
  });

  ipcMain.handle("preview-html", async (event, htmlContent) => {
    try {
      const previewWin = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          contextIsolation: true,
          sandbox: false,
          nodeIntegration: false,
        },
      });

      await previewWin.loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
      );

      previewWin.show();
      return { status: "ok" };
    } catch (err) {
      console.error("preview-html error:", err);
      return { status: "error", message: err.message };
    }
  });

  ipcMain.handle("html-to-pdf-preview", async (event, htmlContent) => {
    try {
      const pdfPath = await convertHtmlToPdfPreview(htmlContent);
      return { status: "ok", path: pdfPath };
    } catch (err) {
      console.error("html-to-pdf-preview error:", err);
      return { status: "error", message: err.message };
    }
  });
}