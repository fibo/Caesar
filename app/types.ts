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

export type CryptDirection = 'encrypt' | 'decrypt'

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

export type State = {
  BIP39_NUM_WORDS: number
  CRYPT_DIRECTION: CryptDirection
  INITIALIZED: boolean
  INPUT_FILES: FileInfo[]
  LANGUAGE: Language
  PASSPHRASE: string
  USE_BIP39: boolean
}

export type StateKey = keyof State

export type LocalStorageKey = Extract<StateKey, 'BIP39_NUM_WORDS' | 'USE_BIP39'>

export type Action =
  | {
      type: 'CHOOSE_INPUT_FILES'
    }
  | {
      type: 'CLEAR_INPUT_FILES'
    }
  | {
      type: 'CLEAR_PASSPHRASE'
    }
  | {
      type: 'CREATE_OUTPUT_FILES'
    }
  | {
      type: 'FONT_LOADED'
    }
  | {
      type: 'GENERATE_BIP39_WORDS'
    }
  | {
      type: 'SET_BIP39_NUM_WORDS'
      num: number
    }
  | {
      type: 'SET_CRYPT_DIRECTION'
      direction: CryptDirection
    }
  | {
      type: 'SET_LANGUAGE'
      language: Language
    }
  | {
      type: 'SET_PASSPHRASE'
      passphrase: string
    }
  | {
      type: 'SET_USE_BIP39'
      value: boolean
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
