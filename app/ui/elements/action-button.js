import { state, subscribe } from '../pubsub.js'

class ActionButton extends HTMLElement {
  button = document.createElement('button')

  connectedCallback() {
    const { button } = this

    button.addEventListener('click', this)

    subscribe('CRYPT_DIRECTION', (value) => {
      if (value === 'encrypt') button.textContent = 'encrypt'
      if (value === 'decrypt') button.textContent = 'decrypt'
    })

    this.appendChild(button)
  }

  disconnectedCallback() {
    this.button.removeEventListener('click', this)
  }

  /** @param {Event} event */
  handleEvent(event) {
    if (event.type === 'click') {
      const passphrase = state.get('PASSPHRASE')
      if (typeof passphrase !== 'string') return
      if (!passphrase) return

      const files = state.get('INPUT_FILES')
      if (!Array.isArray(files)) return
      if (files.length === 0) return

      const direction = state.get('CRYPT_DIRECTION')
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
