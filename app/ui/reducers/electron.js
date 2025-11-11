import { reducer, getState } from '../state.js'

reducer(async (action) => {
  if (action.type === 'CHOOSE_INPUT_FILES') {
    const result = await window.electron.chooseFilesDialog()

    if (result.status === 'canceled') return

    if (result.status === 'error') console.error(result.error)

    if (result.status === 'success') {
      const inputFiles = getState('INPUT_FILES')

      // Avoid duplicates.
      for (const file of result.data) {
        if (inputFiles.find((item) => item.id === file.id)) {
          // If file is already in the INPUT_FILES list, skip it.
          continue
        } else {
          inputFiles.push(file)
        }
      }

      return { INPUT_FILES: inputFiles }
    }
  }

  if (action.type === 'CREATE_OUTPUT_FILES') {
    const passphrase = getState('PASSPHRASE')
    if (!passphrase) return
    const files = getState('INPUT_FILES')
    if (files.length === 0) return
    const direction = getState('CRYPT_DIRECTION')
    if (direction === 'encrypt') {
      window.electron.encryptWithPassphrase(passphrase, files)
    }
    if (direction === 'decrypt') {
      window.electron.decryptWithPassphrase(passphrase, files)
    }
    return { INPUT_FILES: [] }
  }
})
