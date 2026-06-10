import { BrowserWindow, screen, session, app, dialog } from "electron";
import path from "path";
import fs from "fs";
const color = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
    bold: "\x1b[1m",
    cyan: "\x1b[36m",
};
const format = {
    info: (text) => `${color.blue}${text}${color.reset}`,
    success: (text) => `${color.green}${text}${color.reset}`,
    warn: (text) => `${color.yellow}${text}${color.reset}`,
    error: (text) => `${color.red}${text}${color.reset}`,
    bold: (text) => `${color.bold}${text}${color.reset}`,
    link: (text) => `${color.cyan}${text}${color.reset}`,
};
export function createMainWindow(__dirname) {
    const buildStart = Date.now();
    const primaryDisplay = screen.getPrimaryDisplay();
    const { x, y, width, height } = primaryDisplay.bounds;
    const iconPath = path.join(app.getAppPath(), "electron/icon.ico");
    const preloadPath = path.join(__dirname, "lib", "preload.mjs");
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
            webSecurity: true,
            disableBlinkFeatures: "AutoLoadIconsForPage",
            spellcheck: true,
        },
    });
    mainWindow.removeMenu();
    mainWindow.maximize();
    mainWindow.show();
    // Setup CORS
    setupCorsHandling();
    // Load App
    loadAppContent(mainWindow, __dirname);
    // Dev shortcuts
    if (isDevMode()) {
        setupDevToolsShortcuts(mainWindow);
    }
    mainWindow.webContents.on("did-finish-load", () => {
        const durationMs = Date.now() - buildStart;
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        const windowCount = BrowserWindow.getAllWindows().length;
        console.log("");
        console.log(`${format.success("BUILD SUCCESSFUL")} in ${format.bold(`${minutes}m ${seconds}s`)}`);
        console.log(`${format.info("Running Windows:")} ${format.bold(`${windowCount}`)}`);
        console.log("");
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
                "Access-Control-Allow-Methods": [
                    "GET, POST, PUT, DELETE, OPTIONS",
                ],
            },
        });
    });
}
function isDevMode() {
    return (process.argv.includes("--enable-remote-module") ||
        process.env.NODE_ENV === "development");
}
function loadAppContent(mainWindow, __dirname) {
    const isDev = isDevMode();
    if (isDev) {
        const devURL = "http://localhost:5001";
        console.log("");
        console.log(format.info("Starting Development Server..."));
        console.log(format.info(`Loading URL: ${devURL}`));
        console.log("");
        mainWindow.loadURL(devURL);
    }
    else {
        const possiblePaths = [
            path.join(__dirname, "web/index.html"),
            path.join(__dirname, "../web/index.html"),
            path.join(__dirname, "../../web/index.html"),
            path.join(app.getAppPath(), "web/index.html"),
        ];
        let indexPath = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                indexPath = p;
                break;
            }
        }
        console.log("");
        console.log(format.info("Searching for production build..."));
        if (!indexPath) {
            dialog.showErrorBox("Application Error", `web/index.html not found.\n\nTried:\n${possiblePaths.join("\n")}`);
            console.log(format.error("ERROR: Production build not found."));
            app.quit();
            return;
        }
        console.log(format.success(`Production build found:`));
        console.log(format.bold(indexPath));
        console.log("");
        mainWindow.loadFile(indexPath);
    }
}
function setupDevToolsShortcuts(mainWindow) {
    mainWindow.webContents.on("before-input-event", (event, input) => {
        // Fullscreen
        if (input.key === "F11") {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
            event.preventDefault();
        }
        // DevTools
        else if (input.key === "F12") {
            mainWindow.webContents.openDevTools({
                mode: "detach",
            });
            event.preventDefault();
        }
        // Reload
        else if (input.key === "F5" ||
            (input.control &&
                input.key.toLowerCase() === "r")) {
            mainWindow.webContents.reload();
            event.preventDefault();
        }
    });
}
