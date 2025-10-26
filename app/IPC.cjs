// Inter Process Communication

const { createHash } = require('node:crypto')
const { readFile, writeFile } = require('node:fs/promises')
const { basename, extname } = require('node:path')
const { Encrypter, Decrypter } = require('age-encryption')
const { dialog, ipcMain } = require('electron')

/**
 * @typedef {import('electron').IpcMainEvent} IpcMainEvent
 * @typedef {import('./types').ChooseFileDialogResponse} ChooseFileDialogResponse
 * @typedef {import('./types').FileInfo} FileInfo
 */

/** @returns {Promise<ChooseFileDialogResponse>} */
async function chooseFilesDialog() {
  try {
    const { filePaths, canceled } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections', 'showHiddenFiles']
    })
    if (canceled)
      return {
        status: 'canceled'
      }

    /** @type {FileInfo[]} */
    const files = filePaths.map((filePath) => {
      // Generate a unique ID for the file based on its path.
      const id = createHash('sha256').update(filePath).digest('hex')
      const fileInfo = {
        id,
        name: basename(filePath),
        extension: extname(filePath),
        path: filePath
      }
      return fileInfo
    })

    return {
      status: 'success',
      data: files
    }
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    }
  }
}

/**
 * @param {IpcMainEvent} _event
 * @param {string} passphrase
 * @param {FileInfo[]} files
 */
async function encryptWithPassphrase(_event, passphrase, files) {
  const encrypter = new Encrypter()
  encrypter.setPassphrase(passphrase)
  for (const file of files) {
    const fileBuffer = await readFile(file.path)
    const encrypted = await encrypter.encrypt(fileBuffer)
    await writeFile(`${file.path}.age`, encrypted)
  }
}

/**
 * @param {IpcMainEvent} _event
 * @param {string} passphrase
 * @param {FileInfo[]} files
 */
async function decryptWithPassphrase(_event, passphrase, files) {
  const decrypter = new Decrypter()
  decrypter.addPassphrase(passphrase)
  for (const file of files) {
    const fileBuffer = await readFile(file.path)
    const encrypted = await decrypter.decrypt(fileBuffer)
    // Remove .age extension.
    const outputPath = file.path.endsWith('.age')
      ? file.path.slice(0, -4)
      : `${file.path}.decrypted`
    // Write decrypted file.
    await writeFile(outputPath, encrypted)
  }
}

function setupIPC() {
  ipcMain.handle('CHOOSE_FILES_DIALOG', chooseFilesDialog)
  ipcMain.handle('DECRYPT_WITH_PASSPHRASE', decryptWithPassphrase)
  ipcMain.handle('ENCRYPT_WITH_PASSPHRASE', encryptWithPassphrase)
}

module.exports = {
  setupIPC
}
