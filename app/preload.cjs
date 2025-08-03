const { contextBridge, ipcRenderer } = require("electron/renderer")

contextBridge.exposeInMainWorld(
  "electron",
  /** @type {import('./window.d.ts').WindowElectron} */
  {
    generateIdentity: () => ipcRenderer.send("generateIdentity")
  }
)
