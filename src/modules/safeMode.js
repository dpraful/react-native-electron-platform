import os from "os";
import { app } from "electron";

function isRunningFromNetwork() {
  try {
    const exePath = app.getPath("exe");
    return exePath.startsWith("\\\\"); // UNC path
  } catch {
    return false;
  }
}

export function shouldUseSafeMode() {
  const network = isRunningFromNetwork();
  const hostname = os.hostname().toLowerCase();
  const vmHint =
    hostname.includes("vm") ||
    hostname.includes("virtual") ||
    hostname.includes("vbox") ||
    hostname.includes("hyper");

  return network || vmHint;
}

export function applySafeMode() {
  console.log("⚠ SAFE MODE ENABLED");
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch("disable-gpu");
  app.commandLine.appendSwitch("disable-software-rasterizer");
  app.commandLine.appendSwitch("no-sandbox");
  app.commandLine.appendSwitch("disable-dev-shm-usage");
}