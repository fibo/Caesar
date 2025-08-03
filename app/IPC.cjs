// Inter Process Communication

const age = require("age-encryption")
const { ipcMain } = require("electron")

async function generateIdentity() {
  const identity = await age.generateIdentity()
  console.log(identity)
}

function setupIPC() {
  ipcMain.on("generateIdentity", generateIdentity)
}

module.exports = {
  setupIPC
}
