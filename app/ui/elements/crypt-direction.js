import { publish, subscribe } from '../state.js'

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

    const encryptLabel = document.createElement('label')
    const decryptLabel = document.createElement('label')

    encryptLabel.textContent = 'Encrypt'
    decryptLabel.textContent = 'Decrypt'

    encryptLabel.append(encrypt)
    decryptLabel.append(decrypt)

    subscribe('CRYPT_DIRECTION', (direction) => {
      if (direction === 'encrypt') {
        encrypt.setAttribute('checked', '')
        decrypt.removeAttribute('checked')
      } else if (direction === 'decrypt') {
        decrypt.setAttribute('checked', '')
        encrypt.removeAttribute('checked')
      }
    })

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
