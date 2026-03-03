import { app, dialog } from "electron";
import path from "path";
import fs from "fs";
import electronUpdater from "electron-updater";
const { autoUpdater } = electronUpdater;

export function setupAutoUpdater(mainWindow) {
  console.log("Current app version:", app.getVersion());
  
  if (!app.isPackaged) {
    console.log("Auto-update disabled in development.");
    return;
  }

  // Check if app-update.yml exists (required for auto-updates)
  const appUpdatePath = path.join(process.resourcesPath, "app-update.yml");
  if (!fs.existsSync(appUpdatePath)) {
    console.log("⚠️  Auto-update disabled: app-update.yml not found.");
    console.log("   This file is only created when publishing updates.");
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
      })
      .catch((err) => {
        console.error("Error showing update dialog:", err);
      });
  });

  autoUpdater.on("error", (err) => {
    console.error("Auto-updater error:", err);
    sendStatus({ status: "error", message: err.message });
  });

  // Check for updates after a short delay
  setTimeout(() => {
    try {
      autoUpdater.checkForUpdates().catch((err) => {
        console.error("Failed to check for updates:", err.message);
      });
    } catch (err) {
      console.error("Auto-updater initialization error:", err);
    }
  }, 3000);
}