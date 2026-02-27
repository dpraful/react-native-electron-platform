import { BrowserWindow, screen, session } from "electron";
import path from "path";
import fs from "fs";
import { app, dialog } from "electron";

export function createMainWindow(__dirname) {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, width, height } = primaryDisplay.bounds;

  const iconPath = path.join(app.getAppPath(), "electron/icon.ico");
  const preloadPath = path.join(__dirname, "preload.mjs");

  const mainWindow = new BrowserWindow({
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

  // CORS handling
  setupCorsHandling();

  // Load the app
  loadAppContent(mainWindow, __dirname);

  // Setup dev tools shortcuts in development
  if (isDevMode()) {
    setupDevToolsShortcuts(mainWindow);
  }

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("Page loaded successfully");
  });

  return mainWindow;
}

function setupCorsHandling() {
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
}

function isDevMode() {
  return process.argv.includes("--enable-remote-module") ||
    process.env.NODE_ENV === "development";
}

function loadAppContent(mainWindow, __dirname) {
  const isDev = isDevMode();

  if (isDev) {
    mainWindow.loadURL("http://localhost:5001");
    console.log("DEV MODE: http://localhost:5001");
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
}

function setupDevToolsShortcuts(mainWindow) {
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
}