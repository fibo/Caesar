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

export type StateKey =
  | 'BIP39_NUM_WORDS'
  | 'CRYPT_DIRECTION'
  | 'INPUT_FILES'
  | 'LANGUAGE'
  | 'PASSPHRASE'

export type LocalStorageKey = Extract<StateKey, 'BIP39_NUM_WORDS'>

export type Action = {
  type: 'CLEAR_INPUT_FILES'
}

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
