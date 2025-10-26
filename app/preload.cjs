const { contextBridge, ipcRenderer } = require('electron/renderer')

/** @type {import('./types').WindowElectron} */
const windowElectron = {
  chooseFilesDialog: async () => ipcRenderer.invoke('CHOOSE_FILES_DIALOG'),
  encryptWithPassphrase: async (passphrase, files) =>
    ipcRenderer.invoke('ENCRYPT_WITH_PASSPHRASE', passphrase, files),
  decryptWithPassphrase: async (passphrase, files) =>
    ipcRenderer.invoke('DECRYPT_WITH_PASSPHRASE', passphrase, files)
}

contextBridge.exposeInMainWorld('electron', windowElectron)
