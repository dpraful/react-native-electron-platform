import { contextBridge, ipcRenderer } from "electron";

/**
 * Enhanced Electron API with comprehensive features
 * Combines functionality from both codebases
 */
contextBridge.exposeInMainWorld("electronAPI", {
  // ======================================================
  // PLATFORM INFORMATION
  // ======================================================
  platform: process.platform,

  // ======================================================
  // DEEP LINKING / URL HANDLING
  // ======================================================
  
  appOpenURL: {
    /**
     * Add listener for app open URL events
     * @param {Function} listener - Callback function for URL events
     */
    addListener: (listener) => {
      ipcRenderer.addListener('react-native-app-open-url', listener);
      ipcRenderer.invoke('react-native-add-app-open-url').catch(console.error);
    },

    /**
     * Remove listener for app open URL events
     * @param {Function} listener - Callback function to remove
     */
    removeListener: (listener) => {
      ipcRenderer.removeListener('react-native-app-open-url', listener);
    }
  },

  /**
   * Get the initial URL that opened the app
   * @returns {Promise<string>} - Initial URL or null
   */
  getInitialURL: () => ipcRenderer.invoke('react-native-get-initial-url'),

  /**
   * Open a URL in the default browser
   * @param {string} url - URL to open
   * @returns {Promise<void>}
   */
  openURL: (url) => ipcRenderer.invoke('react-native-open-url', url),

  // ======================================================
  // CLIPBOARD OPERATIONS
  // ======================================================

  /**
   * Get text from clipboard
   * @returns {Promise<string>} - Clipboard text
   */
  getClipboardText: () => ipcRenderer.invoke('react-native-get-clipboard-text'),

  /**
   * Set text to clipboard
   * @param {string} text - Text to copy to clipboard
   * @returns {Promise<void>}
   */
  setClipboardText: (text) => ipcRenderer.invoke('react-native-set-clipboard-text', text),

  // ======================================================
  // DIALOGS
  // ======================================================

  /**
   * Show an alert dialog
   * @param {Object} config - Alert configuration
   * @param {string} config.title - Alert title
   * @param {string} config.message - Alert message
   * @param {Array} config.buttons - Button configurations
   * @returns {Promise<Object>} - Alert result
   */
  showAlert: (config) => ipcRenderer.invoke('react-native-show-alert', config),

  // ======================================================
  // NETWORK OPERATIONS
  // ======================================================

  /**
   * Make a network call
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} url - Request URL
   * @param {Object} params - Request parameters
   * @param {Object} headers - Request headers
   * @returns {Promise<Object>} - Network response
   */
  networkCall: (method, url, params = {}, headers = {}) =>
    ipcRenderer.invoke("network-call", { method, url, params, headers }),

  // ======================================================
  // PDF OPERATIONS
  // ======================================================

  /**
   * Save HTML as PDF
   * @param {string} html - HTML content to convert
   * @returns {Promise<Object>} - Save result
   */
  savePDF: (html) => ipcRenderer.invoke("save-pdf", html),

  /**
   * Post PDF preview
   * @param {Object} payload - PDF preview payload
   * @returns {Promise<Object>} - Preview result
   */
  postPdfPreview: (payload) => ipcRenderer.invoke("post-pdf-preview", payload),

  /**
   * Open PDF preview
   * @param {string} pdfUrl - URL of PDF to preview
   * @returns {Promise<Object>} - Open result
   */
  openPdfPreview: (pdfUrl) => ipcRenderer.invoke("open-pdf-preview", pdfUrl),

  // ======================================================
  // FILE OPERATIONS
  // ======================================================

  /**
   * Open file selection dialog
   * @returns {Promise<Object>} - Selected file info
   */
  selectFile: () => ipcRenderer.invoke("select-file"),

  // ======================================================
  // HTML/PDF PREVIEW
  // ======================================================

  /**
   * Preview HTML content
   * @param {string} htmlContent - HTML to preview
   * @returns {Promise<Object>} - Preview result
   */
  previewHTML: (htmlContent) => ipcRenderer.invoke("preview-html", htmlContent),

  /**
   * Convert HTML to PDF and preview
   * @param {string} htmlContent - HTML to convert
   * @returns {Promise<Object>} - PDF preview result
   */
  htmlToPdfPreview: (htmlContent) => ipcRenderer.invoke("html-to-pdf-preview", htmlContent),

  // ======================================================
  // AUTO-UPDATER APIS
  // ======================================================
  
  /**
   * Listen for update status events from main process
   * @param {Function} callback - Function to call when update status changes
   * @returns {Function} - Cleanup function to remove listener
   */
  onUpdateStatus: (callback) => {
    const listener = (event, data) => callback(data);
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
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // ======================================================
  // UTILITY FUNCTIONS
  // ======================================================

  /**
   * Generic event listener with cleanup pattern
   * @param {string} channel - IPC channel to listen on
   * @param {Function} callback - Callback function
   * @returns {Function} - Cleanup function
   */
  on: (channel, callback) => {
    const listener = (event, ...args) => callback(...args);
    ipcRenderer.on(channel, listener);
    return () => {
      ipcRenderer.removeListener(channel, listener);
    };
  },

  /**
   * Send an IPC message without waiting for response
   * @param {string} channel - IPC channel
   * @param {...any} args - Arguments to send
   */
  send: (channel, ...args) => {
    ipcRenderer.send(channel, ...args);
  },

  /**
   * Invoke an IPC method and wait for response
   * @param {string} channel - IPC channel
   * @param {...any} args - Arguments to send
   * @returns {Promise<any>} - Response from main process
   */
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});

// Log that preload has loaded
console.log('✅ Electron API exposed to renderer process');