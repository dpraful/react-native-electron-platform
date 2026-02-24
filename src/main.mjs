import { app, BrowserWindow, session, screen, ipcMain, dialog } from "electron";
import electronUpdater from "electron-updater";
const { autoUpdater } = electronUpdater;
import path from "path";
import fs from "fs";
import { Readable } from "stream";
import os from "os";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import packageJson from "../../../package.json" with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

function isRunningFromNetwork() {
  try {
    const exePath = app.getPath("exe");
    return exePath.startsWith("\\\\"); // UNC path
  } catch {
    return false;
  }
}

function shouldUseSafeMode() {
  const network = isRunningFromNetwork();

  const hostname = os.hostname().toLowerCase();
  const vmHint =
    hostname.includes("vm") ||
    hostname.includes("virtual") ||
    hostname.includes("vbox") ||
    hostname.includes("hyper");

  return network || vmHint;
}

// Apply BEFORE Electron ready
if (shouldUseSafeMode()) {
  console.log("⚠ SAFE MODE ENABLED");

  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch("disable-gpu");
  app.commandLine.appendSwitch("disable-software-rasterizer");
  app.commandLine.appendSwitch("no-sandbox");
  app.commandLine.appendSwitch("disable-dev-shm-usage");
} else {
  console.log("✅ NORMAL MODE");
}

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, width, height } = primaryDisplay.bounds;

  const iconPath = path.join(__dirname, "icon.ico");
  const preloadPath = path.join(__dirname, "preload.js");

  mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    show: false,
    icon: iconPath,
    frame: true,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: false,
      disableBlinkFeatures: "AutoLoadIconsForPage",
      nativeWindowOpen: true,
      spellcheck: true,
    },
  });

  mainWindow.removeMenu();
  mainWindow.maximize();
  mainWindow.show();

  mainWindow.on("resize", () => {
    const bounds = mainWindow.getBounds();
    if (bounds?.width && bounds?.height) {
      console.log(`Window resized: ${bounds.width}x${bounds.height}`);
    }
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };

    delete responseHeaders["access-control-allow-origin"];
    delete responseHeaders["access-control-allow-headers"];
    delete responseHeaders["access-control-allow-methods"];
    delete responseHeaders["Access-Control-Allow-Origin"];
    delete responseHeaders["Access-Control-Allow-Headers"];
    delete responseHeaders["Access-Control-Allow-Methods"];

    callback({
      responseHeaders: {
        ...responseHeaders,
        "Access-Control-Allow-Origin": ["*"],
        "Access-Control-Allow-Headers": ["*"],
        "Access-Control-Allow-Methods": ["GET, POST, PUT, DELETE, OPTIONS"],
      },
    });
  });

  const isDev =
    process.argv.includes("--enable-remote-module") ||
    process.env.NODE_ENV === "development";

  if (isDev) {
    mainWindow.loadURL("http://localhost:5001");
    console.log("DEV MODE: http://localhost:5001");

    mainWindow.webContents.on("before-input-event", (event, input) => {
      if (input.control && input.shift && input.key.toLowerCase() === "i") {
        mainWindow.webContents.toggleDevTools();
        event.preventDefault();
      } else if (input.key === "F12") {
        mainWindow.webContents.toggleDevTools();
        event.preventDefault();
      } else if (
        input.key === "F5" ||
        (input.control && input.key.toLowerCase() === "r")
      ) {
        mainWindow.webContents.reload();
        event.preventDefault();
      }
    });
  } else {
    const possiblePaths = [
      path.join(__dirname, "web-build/index.html"),
      path.join(__dirname, "../web-build/index.html"),
      path.join(__dirname, "../../web-build/index.html"),
      path.join(app.getAppPath(), "web-build/index.html"),
    ];

    let indexPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        indexPath = p;
        break;
      }
    }

    console.log("Loading:", indexPath);

    if (!indexPath) {
      dialog.showErrorBox(
        "Application Error",
        `web-build/index.html not found. Tried: ${possiblePaths.join(", ")}`
      );
      app.quit();
      return;
    }

    mainWindow.loadFile(indexPath);
  }

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("Page loaded successfully");
  });
}

/**
 * ----------------------------------------------------
 * AUTO UPDATE (NSIS)
 * ----------------------------------------------------
 */
function setupAutoUpdater() {
  console.log("Current app version:", app.getVersion());
  
  if (!app.isPackaged) {
    console.log("Auto-update disabled in development.");
    return;
  }
  
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  const sendStatus = (data) => {
    if (mainWindow) {
      mainWindow.webContents.send("update-status", data);
    }
  };

  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for updates...");
    sendStatus({ status: "checking" });
  });

  autoUpdater.on("update-available", (info) => {
    console.log("Update available:", info.version);
    sendStatus({ status: "available", version: info.version });
  });

  autoUpdater.on("update-not-available", () => {
    console.log("No updates available");
    sendStatus({ status: "not-available" });
  });

  autoUpdater.on("download-progress", (progress) => {
    console.log(`Download progress: ${Math.round(progress.percent)}%`);
    sendStatus({
      status: "downloading",
      percent: Math.round(progress.percent),
    });
  });

  autoUpdater.on("update-downloaded", () => {
    console.log("Update downloaded");
    sendStatus({ status: "downloaded" });

    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        title: "Update Ready",
        message: "A new version has been downloaded. Restart now?",
        buttons: ["Restart", "Later"],
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });

  autoUpdater.on("error", (err) => {
    console.error("Auto-updater error:", err);
    sendStatus({ status: "error", message: err.message });
  });

  // Check for updates after a short delay to ensure window is ready
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 3000);
}

/**
 * ----------------------------------------------------
 * IPC: MANUAL UPDATE CHECK
 * ----------------------------------------------------
 */
ipcMain.handle("check-for-updates", async () => {
  if (app.isPackaged) {
    autoUpdater.checkForUpdates();
    return { status: "checking" };
  }
  return { status: "disabled", message: "Auto-update disabled in development" };
});

//
// ======================================================
// NETWORK SERVICE
// ======================================================
//

async function NetworkServiceCall(method, url, params = {}, headers = {}) {
  try {
    const upperMethod = method.toUpperCase();

    const options = {
      method: upperMethod,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (upperMethod !== "GET") {
      options.body = JSON.stringify(params);
    } else if (params && Object.keys(params).length > 0) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }

    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (response.ok || data?.httpstatus === 200) {
      return { httpstatus: 200, data: data?.data || data };
    }

    return {
      httpstatus: response.status,
      data: { title: "ERROR", message: data?.message || "Network Error" },
    };
  } catch (err) {
    return {
      httpstatus: 404,
      data: { title: "ERROR", message: err.message },
    };
  }
}

ipcMain.handle("network-call", async (event, payload) => {
  try {
    const { method, url, params, headers } = payload;
    console.log("IPC network-call:", { method, url });
    return NetworkServiceCall(method, url, params, headers);
  } catch (err) {
    console.error("IPC network-call error:", err);
    return {
      httpstatus: 500,
      data: { title: "ERROR", message: err.message },
    };
  }
});

//
// ======================================================
// PDF / FILE IPC
// ======================================================
//

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
      return "saved";
    }

    return "cancelled";
  } catch (err) {
    console.error("IPC save-pdf error:", err);
    throw err;
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

ipcMain.handle("preview-html", async (event, htmlContent) => {
  try {
    // Create a new hidden BrowserWindow for preview
    const previewWin = new BrowserWindow({
      width: 800,
      height: 600,
      show: false, // hide until ready
      webPreferences: {
        contextIsolation: true,
        sandbox: false,
        nodeIntegration: false,
      },
    });

    // Load the HTML content
    await previewWin.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
    );

    // Show the window once loaded
    previewWin.show();

    return { status: "ok" };
  } catch (err) {
    console.error("preview-html error:", err);
    return { status: "error", message: err.message };
  }
});

async function convertHtmlToPdfPreview(htmlContent, options = {}) {
  try {
    // Step 1: Create a hidden BrowserWindow
    const tempWin = new BrowserWindow({
      show: false,
      webPreferences: {
        offscreen: true,
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    // Step 2: Load HTML into the window
    await tempWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    // Step 3: Generate PDF
    const pdfBuffer = await tempWin.webContents.printToPDF({
      printBackground: true,
      ...options,
    });

    tempWin.destroy();

    // Step 4: Save PDF to temp folder
    const pdfFileName = `Preview_${Date.now()}.pdf`;
    const pdfPath = path.join(app.getPath("temp"), pdfFileName);
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Step 5: Open a new window to preview the PDF
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

ipcMain.handle("html-to-pdf-preview", async (event, htmlContent) => {
  try {
    const pdfPath = await convertHtmlToPdfPreview(htmlContent);
    return { status: "ok", path: pdfPath };
  } catch (err) {
    console.error("html-to-pdf-preview error:", err);
    return { status: "error", message: err.message };
  }
});

//
// ======================================================
// APP READY
// ======================================================
//

app.whenReady().then(() => {
  if (process.platform === "win32") {
    app.setAppUserModelId(`com.${packageJson.name}.desktop`);
  }
  createWindow();
  setupAutoUpdater();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});