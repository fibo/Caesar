import { publish } from '../state.js'

class CryptDirection extends HTMLElement {
  encrypt = document.createElement('input')
  decrypt = document.createElement('input')

  connectedCallback() {
    const { encrypt, decrypt } = this

    for (const input of [encrypt, decrypt]) {
      input.type = 'radio'
      input.name = 'crypt-direction'
      input.addEventListener('change', this)
    }

    const encryptText = document.createElement('span')
    const decryptText = document.createElement('span')
    encryptText.textContent = 'Encrypt'
    decryptText.textContent = 'Decrypt'

    const encryptLabel = document.createElement('label')
    const decryptLabel = document.createElement('label')

    encryptLabel.append(encrypt, encryptText)
    decryptLabel.append(decrypt, decryptText)

    encrypt.checked = true
    publish('CRYPT_DIRECTION', 'encrypt')

    this.append(encryptLabel, decryptLabel)
  }

  /** @param {Event} event */
  handleEvent(event) {
    if (event.type === 'change') {
      if (event.target === this.encrypt) {
        publish('CRYPT_DIRECTION', 'encrypt')
      }
      if (event.target === this.decrypt) {
        publish('CRYPT_DIRECTION', 'decrypt')
      }
    }
  }
}

customElements.define('crypt-direction', CryptDirection)
