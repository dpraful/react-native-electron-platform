import { spawn, spawnSync } from "child_process";
import http from "http";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const initialRoot = resolve(process.env.INIT_CWD || process.cwd());
const appRoot = initialRoot === packageRoot
    ? resolve(packageRoot, "..", "..")
    : initialRoot;
const nodeCommand = process.execPath;
const npmCliPath = process.env.npm_execpath;
const command = process.argv[2];
const isWindows = process.platform === "win32";
const webpackCommand = isWindows ? "webpack.cmd" : "webpack";
const electronCommand = isWindows ? "electron.cmd" : "electron";
const electronBuilderCommand = isWindows ? "electron-builder.cmd" : "electron-builder";
function runSync(executable, args, options = {}) {
    const result = spawnSync(executable, args, {
        cwd: options.cwd || appRoot,
        env: {
            ...process.env,
            INIT_CWD: appRoot,
            ...options.env,
        },
        stdio: "inherit",
        shell: isWindows && /\.(cmd|bat)$/i.test(executable),
    });
    if (result.error)
        throw result.error;
    if (result.status !== 0)
        process.exit(result.status ?? 1);
}
function runNpm(args, cwd) {
    if (npmCliPath) {
        runSync(nodeCommand, [npmCliPath, ...args], { cwd });
        return;
    }
    runSync(isWindows ? "npm.cmd" : "npm", args, { cwd });
}
function buildRuntime() {
    runNpm(["run", "build:ts"], packageRoot);
}
function preelectron() {
    buildRuntime();
    runSync(nodeCommand, [join(packageRoot, "scripts", "preelectron.mjs")]);
}
function web() {
    buildRuntime();
    runSync(webpackCommand, [
        "serve",
        "--config",
        join(packageRoot, "webpack.config.mjs"),
        "--mode",
        "development",
    ]);
}
function webBuild() {
    buildRuntime();
    runSync(webpackCommand, [
        "--config",
        join(packageRoot, "webpack.config.mjs"),
        "--mode",
        "production",
    ]);
}
function electronDev() {
    buildRuntime();
    runSync(electronCommand, [".", "--enable-remote-module"], {
        env: { NODE_ENV: "development" },
    });
}
function buildElectron(args) {
    webBuild();
    runSync(electronBuilderCommand, [
        "--config",
        join(packageRoot, "electron-builder.json"),
        ...args,
    ]);
}
function waitForServer(url, timeoutMs = 120000) {
    const started = Date.now();
    return new Promise((resolveReady, rejectReady) => {
        const check = () => {
            const req = http.get(url, (res) => {
                res.resume();
                resolveReady();
            });
            req.on("error", () => {
                if (Date.now() - started > timeoutMs) {
                    rejectReady(new Error(`Timed out waiting for ${url}`));
                    return;
                }
                setTimeout(check, 500);
            });
            req.setTimeout(3000, () => {
                req.destroy();
            });
        };
        check();
    });
}
async function electron() {
    preelectron();
    const env = {
        ...process.env,
        INIT_CWD: appRoot,
        NODE_ENV: "development",
    };
    const webProcess = spawn(webpackCommand, [
        "serve",
        "--config",
        join(packageRoot, "webpack.config.mjs"),
        "--mode",
        "development",
    ], {
        cwd: appRoot,
        env,
        stdio: "inherit",
        shell: isWindows,
    });
    const stopWeb = () => {
        if (!webProcess.killed)
            webProcess.kill();
    };
    process.on("exit", stopWeb);
    process.on("SIGINT", () => {
        stopWeb();
        process.exit(130);
    });
    webProcess.on("exit", (code) => {
        if (code && code !== 0)
            process.exit(code);
    });
    await waitForServer("http://localhost:5001");
    const electronProcess = spawn(electronCommand, ["."], {
        cwd: appRoot,
        env,
        stdio: "inherit",
        shell: isWindows,
    });
    electronProcess.on("exit", (code) => {
        stopWeb();
        process.exit(code ?? 0);
    });
}
switch (command) {
    case "build":
        buildRuntime();
        break;
    case "typecheck":
        runNpm(["run", "typecheck"], packageRoot);
        break;
    case "preelectron":
        preelectron();
        break;
    case "web":
        web();
        break;
    case "web:build":
        webBuild();
        break;
    case "electron":
        await electron();
        break;
    case "electron:dev":
        electronDev();
        break;
    case "electron:build":
        buildElectron([]);
        break;
    case "electron:build:nsis":
        buildElectron(["--win", "nsis", "--publish", "never"]);
        break;
    case "electron:build:msi":
        buildElectron(["--win", "msi", "--publish", "never"]);
        break;
    case "electron:build:mac":
        buildElectron(["--mac", "--publish", "never"]);
        break;
    case "electron:build:mac:dmg":
        buildElectron(["--mac", "dmg", "--publish", "never"]);
        break;
    case "electron:build:mac:zip":
        buildElectron(["--mac", "zip", "--publish", "never"]);
        break;
    case "electron:build:linux":
        buildElectron(["--linux", "--publish", "never"]);
        break;
    case "electron:build:linux:appimage":
        buildElectron(["--linux", "AppImage", "--publish", "never"]);
        break;
    case "electron:build:linux:deb":
        buildElectron(["--linux", "deb", "--publish", "never"]);
        break;
    case "electron:build:linux:rpm":
        buildElectron(["--linux", "rpm", "--publish", "never"]);
        break;
    default:
        console.error("Usage: node node_modules/react-native-electron-platform/scripts/run.mjs <build|typecheck|preelectron|web|web:build|electron|electron:dev|electron:build|electron:build:nsis|electron:build:msi|electron:build:mac|electron:build:mac:dmg|electron:build:mac:zip|electron:build:linux|electron:build:linux:appimage|electron:build:linux:deb|electron:build:linux:rpm>");
        process.exit(1);
}
