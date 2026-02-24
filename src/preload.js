import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Network
  networkCall: (method, url, params = {}, headers = {}) =>
    ipcRenderer.invoke("network-call", { method, url, params, headers }),

  // PDF Operations
  savePDF: (html) =>
    ipcRenderer.invoke("save-pdf", html),

  postPdfPreview: (payload) =>
    ipcRenderer.invoke("post-pdf-preview", payload),

  openPdfPreview: (pdfUrl) =>
    ipcRenderer.invoke("open-pdf-preview", pdfUrl),

  // File Operations
  selectFile: () => ipcRenderer.invoke("select-file"),

  // HTML/PDF Preview
  previewHTML: (htmlContent) =>
    ipcRenderer.invoke("preview-html", htmlContent),

  htmlToPdfPreview: (htmlContent) =>
    ipcRenderer.invoke("html-to-pdf-preview", htmlContent),

  // ======================================================
  // AUTO-UPDATER APIs (NEW)
  // ======================================================
  
  /**
   * Listen for update status events from main process
   * @param {Function} callback - Function to call when update status changes
   * @returns {Function} - Cleanup function to remove listener
   */
  onUpdateStatus: (callback) => {
    // Create the listener
    const listener = (event, data) => callback(data);
    
    // Add the listener
    ipcRenderer.on('update-status', listener);
    
    // Return cleanup function
    return () => {
      ipcRenderer.removeListener('update-status', listener);
    };
  },

  /**
   * Manually check for updates
   * @returns {Promise<Object>} - Status of update check
   */
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),

  /**
   * Get the current app version
   * @returns {Promise<string>} - Current version
   */
  getAppVersion: () => ipcRenderer.invoke("get-app-version")
});