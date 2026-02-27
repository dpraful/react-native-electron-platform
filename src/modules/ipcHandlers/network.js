import { ipcMain } from "electron";
import { networkServiceCall } from '../networkService.js';

export function registerNetworkHandlers() {
  ipcMain.handle("network-call", async (event, payload) => {
    try {
      const { method, url, params, headers } = payload;
      console.log("IPC network-call:", { method, url });
      return await networkServiceCall(method, url, params, headers);
    } catch (err) {
      console.error("IPC network-call error:", err);
      return {
        httpstatus: 500,
        data: { title: "ERROR", message: err.message },
      };
    }
  });
}