import { getState, subscribe } from '../state.js'

class ActionButton extends HTMLElement {
  button = document.createElement('button')

  connectedCallback() {
    const { button } = this

    button.type = 'button'
    button.classList.add('primary')
    button.addEventListener('click', this)

    subscribe('CRYPT_DIRECTION', (value) => {
      if (value === 'encrypt') {
        button.textContent = 'Encrypt Files'
      }
      if (value === 'decrypt') {
        button.textContent = 'Decrypt Files'
      }
    })

    this.appendChild(button)
  }

  disconnectedCallback() {
    this.button.removeEventListener('click', this)
  }

  /** @param {Event} event */
  handleEvent(event) {
    if (event.type === 'click') {
      const passphrase = getState('PASSPHRASE')
      if (typeof passphrase !== 'string') return
      if (!passphrase) return

      const files = getState('INPUT_FILES')
      if (!Array.isArray(files)) return
      if (files.length === 0) return

      const direction = getState('CRYPT_DIRECTION')
      if (direction === 'encrypt') {
        window.electron.encryptWithPassphrase(passphrase, files)
      }
      if (direction === 'decrypt') {
        window.electron.decryptWithPassphrase(passphrase, files)
      }
    }
  }
}

customElements.define('action-button', ActionButton)
