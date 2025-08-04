const { contextBridge, ipcRenderer } = require("electron/renderer")

/** @type {import('./types').WindowElectron} */
const windowElectron = {
  generateIdentity: () => ipcRenderer.send("generate-identity")
}

contextBridge.exposeInMainWorld("electron", windowElectron)
