import fs from "fs";
import path from "path";

const src = path.join(
  process.cwd(),
  "node_modules",
  "react-native-electron-platform",
  "templates",
  "electron"
);

const dest = path.join(process.cwd(), "electron");

try {
  if (!fs.existsSync(dest)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log("Electron template copied successfully");
  } else {
    console.log("Electron folder already exists");
  }
} catch (err) {
  console.error("Error copying electron folder:", err);
}