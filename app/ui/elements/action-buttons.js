import { dispatch, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').FileInfo} FileInfo
 */

class ActionButtons extends HTMLElement {
  button = document.createElement('button')

  /** @type {boolean | undefined} */
  hasInputFiles
  /** @type {boolean | undefined} */
  hasPassphrase

  connectedCallback() {
    const { button } = this

    button.type = 'button'
    button.classList.add('primary')

    this.append(button)

    button.addEventListener('click', () => {
      dispatch({ type: 'CREATE_OUTPUT_FILES' })
    })

    subscribe('CRYPT_DIRECTION', (value) => {
      if (value === 'encrypt') {
        button.textContent = 'Encrypt Files'
      }
      if (value === 'decrypt') {
        button.textContent = 'Decrypt Files'
      }
    })

    subscribe('PASSPHRASE', (/** @type {string} */ passphrase) => {
      this.hasPassphrase = passphrase.length > 0
      this.setButtonState()
    })

    subscribe('INPUT_FILES', (/** @type {FileInfo[]} */ files) => {
      this.hasInputFiles = files.length > 0
      this.setButtonState()
    })
  }

  setButtonState() {
    this.button.disabled = !(this.hasInputFiles && this.hasPassphrase)
  }
}

customElements.define('action-buttons', ActionButtons)
