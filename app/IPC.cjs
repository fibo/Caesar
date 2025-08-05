// Inter Process Communication

const age = require("age-encryption")
const { ipcMain } = require("electron")

/**
 * @typedef {import('./types').IpcEvent} IpcEvent
 */

/** @type {IpcEvent} */
const GENERATE_IDENTITY = "GENERATE_IDENTITY"

async function generateIdentity() {
  const identity = await age.generateIdentity()
  console.log(identity)
}

function setupIPC() {
  ipcMain.on(GENERATE_IDENTITY, generateIdentity)
}

module.exports = {
  setupIPC
}
