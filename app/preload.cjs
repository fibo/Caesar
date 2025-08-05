const { contextBridge, ipcRenderer } = require("electron/renderer")

/**
 * @typedef {import('./types').IpcEvent} IpcEvent
 * @typedef {import('./types').WindowElectron} WindowElectron
 */

/** @type {IpcEvent} */ const GENERATE_IDENTITY = "GENERATE_IDENTITY"

/** @type {import('./types').WindowElectron} */
const windowElectron = {
  generateIdentity: () => ipcRenderer.send(GENERATE_IDENTITY)
}

contextBridge.exposeInMainWorld("electron", windowElectron)
