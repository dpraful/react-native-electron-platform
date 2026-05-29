import { ipcMain, dialog, BrowserWindow, net } from "electron";
import fs from "fs";
import path from "path";
import { app } from "electron";
import { convertHtmlToPdfPreview } from '../pdfHelper.js';
// Export PDF handler names as constants
export const PDF_HANDLER_NAMES = {
    SAVE_PDF: 'save-pdf',
    POST_PDF_PREVIEW: 'post-pdf-preview',
    OPEN_PDF_PREVIEW: 'open-pdf-preview',
    PREVIEW_HTML: 'preview-html',
    HTML_TO_PDF_PREVIEW: 'html-to-pdf-preview'
};
export async function savePdf(event, html) {
    try {
        console.log("IPC save-pdf called");
        const tempWin = new BrowserWindow({
            show: false,
            webPreferences: { offscreen: true },
        });
        await tempWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
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
    }
    catch (err) {
        console.error("IPC save-pdf error:", err);
        return { status: "error", message: err.message };
    }
}
export async function postPdfPreview(event, payload) {
    try {
        const { url, data, headers = {} } = payload;
        console.log("IPC post-pdf-preview:", { url });
        const fileName = `Report_${Date.now()}.pdf`;
        const tempPath = path.join(app.getPath("temp"), fileName);
        await new Promise((resolve, reject) => {
            const req = net.request({
                method: "POST",
                url: url,
            });
            // Set headers
            req.setHeader("Content-Type", "application/json");
            req.setHeader("Accept", "application/pdf");
            Object.entries(headers).forEach(([key, value]) => {
                req.setHeader(key, value.toString());
            });
            req.on('response', (res) => {
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    reject(new Error(`HTTP ${res.statusCode}`));
                    return;
                }
                const chunks = [];
                const fileStream = fs.createWriteStream(tempPath);
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => {
                    fileStream.end(Buffer.concat(chunks));
                });
                res.on('error', reject);
                fileStream.on('finish', resolve);
                fileStream.on('error', reject);
            });
            req.on('error', reject);
            req.write(typeof data === "string" || Buffer.isBuffer(data) ? data : JSON.stringify(data));
            req.end();
        });
        return {
            status: "ok",
            path: `file://${tempPath}`,
        };
    }
    catch (err) {
        console.error("post-pdf-preview error:", err);
        return {
            status: "error",
            message: err.message,
        };
    }
}
export async function openPdfPreview(pdfUrl) {
    try {
        // Check if it's already a file:// URL
        if (pdfUrl.startsWith('file://')) {
            // It's already a local file, just return it
            return pdfUrl;
        }
        // It's an HTTP(S) URL, fetch it
        const buffer = await new Promise((resolve, reject) => {
            net.request(pdfUrl).on('response', (res) => {
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
                res.on('error', reject);
            }).on('error', reject).end();
        });
        const tempPath = path.join(app.getPath("temp"), `preview_${Date.now()}.pdf`);
        fs.writeFileSync(tempPath, buffer);
        return `file://${tempPath}`;
    }
    catch (err) {
        console.error("open-pdf-preview error:", err);
        throw err;
    }
}
export async function previewHtml(event, htmlContent) {
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
        await previewWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
        previewWin.show();
        return { status: "ok" };
    }
    catch (err) {
        console.error("preview-html error:", err);
        return { status: "error", message: err.message };
    }
}
export async function htmlToPdfPreview(event, htmlContent) {
    try {
        const pdfPath = await convertHtmlToPdfPreview(htmlContent);
        return { status: "ok", path: pdfPath };
    }
    catch (err) {
        console.error("html-to-pdf-preview error:", err);
        return { status: "error", message: err.message };
    }
}
export function registerPdfHandlers() {
    ipcMain.handle(PDF_HANDLER_NAMES.SAVE_PDF, async (event, html) => {
        return await savePdf(event, html);
    });
    ipcMain.handle(PDF_HANDLER_NAMES.POST_PDF_PREVIEW, async (event, payload) => {
        return await postPdfPreview(event, payload);
    });
    ipcMain.handle(PDF_HANDLER_NAMES.OPEN_PDF_PREVIEW, async (_, pdfUrl) => {
        return await openPdfPreview(pdfUrl);
    });
    ipcMain.handle(PDF_HANDLER_NAMES.PREVIEW_HTML, async (event, htmlContent) => {
        return await previewHtml(event, htmlContent);
    });
    ipcMain.handle(PDF_HANDLER_NAMES.HTML_TO_PDF_PREVIEW, async (event, htmlContent) => {
        return await htmlToPdfPreview(event, htmlContent);
    });
}
