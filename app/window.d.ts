/** API exposed by Electron context bridge. */
export type WindowElectron = {
  generateIdentity: () => Promise<void>;
}

declare global {
  interface Window {
    electron: WindowElectron;
  }
}
