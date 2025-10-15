/** API exposed by Electron context bridge. */
export type WindowElectron = {
  generateIdentity: () => void
}

declare global {
  interface Window {
    electron: WindowElectron
  }
}

export type IpcEvent = 'GENERATE_IDENTITY'
