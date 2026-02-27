import { BrowserWindow } from "electron";
import fs from "fs";
import path from "path";
import { app } from "electron";

export async function convertHtmlToPdfPreview(htmlContent, options = {}) {
  try {
    const tempWin = new BrowserWindow({
      show: false,
      webPreferences: {
        offscreen: true,
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    await tempWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    const pdfBuffer = await tempWin.webContents.printToPDF({
      printBackground: true,
      ...options,
    });

    tempWin.destroy();

    const pdfFileName = `Preview_${Date.now()}.pdf`;
    const pdfPath = path.join(app.getPath("temp"), pdfFileName);
    fs.writeFileSync(pdfPath, pdfBuffer);

    const previewWin = new BrowserWindow({
      width: 900,
      height: 700,
      show: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    await previewWin.loadURL(`file://${pdfPath}`);
    return pdfPath;
  } catch (err) {
    console.error("convertHtmlToPdfPreview error:", err);
    throw err;
  }
}