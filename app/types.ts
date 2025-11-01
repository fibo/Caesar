export type Language = 'en' | 'it'

export type Font = {
  family: string
  file: string
  languages: Language[]
}

export type FileInfo = {
  id: string
  name: string
  path: string
  extension: string
}

export type ChooseFileDialogResponse =
  | {
      status: 'success'
      data: FileInfo[]
    }
  | {
      status: 'error'
      error: string
    }
  | {
      status: 'canceled'
    }

export type PubSubKey =
  | 'CRYPT_DIRECTION'
  | 'INPUT_FILES'
  | 'LANGUAGE'
  | 'PASSPHRASE'

/** API exposed by Electron context bridge. */
export type WindowElectron = {
  chooseFilesDialog: () => Promise<ChooseFileDialogResponse>
  encryptWithPassphrase: (
    passphrase: string,
    files: FileInfo[]
  ) => Promise<void>
  decryptWithPassphrase: (
    passphrase: string,
    files: FileInfo[]
  ) => Promise<void>
}

declare global {
  interface Window {
    electron: WindowElectron
  }
}
