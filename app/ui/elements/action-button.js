import { dispatch, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').CryptDirection} CryptDirection
 * @typedef {import('../../types').FileInfo} FileInfo
 * @typedef {import('../../types').Language} Language
 */

class ActionButton extends HTMLElement {
  button = document.createElement('button')

  connectedCallback() {
    const { button } = this

    button.type = 'button'
    button.classList.add('primary')

    this.append(button)

    button.addEventListener('click', () => {
      dispatch({ type: 'CREATE_OUTPUT_FILES' })
    })

    subscribe('CRYPT_DIRECTION', (/** @type {CryptDirection} */ value) => {
      this.cryptDirection = value
      this.updateTranslations()
    })

    subscribe('PASSPHRASE', (/** @type {string} */ passphrase) => {
      this.hasPassphrase = passphrase.length > 0
      this.setButtonState()
    })

    subscribe('INPUT_FILES', (/** @type {FileInfo[]} */ files) => {
      this.hasInputFiles = files.length > 0
      this.setButtonState()
    })

    subscribe('LANGUAGE', (/** @type {Language} */ language) => {
      this.language = language
      this.updateTranslations()
    })
  }

  setButtonState() {
    this.button.disabled = !(this.hasInputFiles && this.hasPassphrase)
  }

  updateTranslations() {
    const { button, cryptDirection, language } = this
    if (!language) return
    if (!cryptDirection) return

    if (cryptDirection === 'encrypt') {
      button.textContent = 'Encrypt Files'
    }
    if (cryptDirection === 'decrypt') {
      button.textContent = 'Decrypt Files'
    }
  }
}

customElements.define('action-button', ActionButton)
