import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const initialRoot = path.resolve(process.env.INIT_CWD || process.cwd());
const appRoot = initialRoot === packageRoot
    ? path.resolve(packageRoot, "..", "..")
    : initialRoot;
const lib = path.join(packageRoot, "templates", "electron");
const dest = path.join(appRoot, "electron");
function copyMissing(sourceDir, destDir) {
    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
        const sourcePath = path.join(sourceDir, entry.name);
        const destPath = path.join(destDir, entry.name);
        if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            copyMissing(sourcePath, destPath);
            continue;
        }
        if (!fs.existsSync(destPath)) {
            fs.copyFileSync(sourcePath, destPath);
        }
    }
}
try {
    if (!fs.existsSync(dest)) {
        fs.cpSync(lib, dest, { recursive: true });
        console.log("Electron template copied successfully");
    }
    else {
        copyMissing(lib, dest);
        console.log("Electron folder already exists");
    }
}
catch (err) {
    console.error("Error copying electron folder:", err);
}
