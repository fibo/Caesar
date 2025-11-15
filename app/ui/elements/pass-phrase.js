import { dispatch, getState, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').Language} Language
 */

class PassPhrase extends HTMLElement {
  input = document.createElement('input')
  inputContainer = document.createElement('div')
  inputLabel = document.createElement('label')
  bip39 = document.createElement('bip-39')

  connectedCallback() {
    const { input, inputContainer, inputLabel, bip39 } = this

    inputContainer.classList.add('input-text')
    inputLabel.htmlFor = input.id = 'passphrase'
    input.type = 'text'
    input.setAttribute('spellcheck', 'false')
    inputContainer.append(inputLabel, input)

    this.append(inputContainer, bip39)

    input.addEventListener('input', () => {
      dispatch({ type: 'SET_PASSPHRASE', passphrase: input.value })
    })

    subscribe('LANGUAGE', (/** @type {Language} */ language) => {
      this.language = language
      this.updateTranslations()
    })

    subscribe('CRYPT_DIRECTION', (direction) => {
      dispatch({ type: 'CLEAR_PASSPHRASE' })

      if (direction === 'encrypt') {
        bip39.hidden = false
        if (getState('USE_BIP39')) input.readOnly = true
        else input.readOnly = false
      }
      if (direction === 'decrypt') {
        bip39.hidden = true
        input.readOnly = false
      }
    })

    subscribe('PASSPHRASE', (/** @type {string} */ passphrase) => {
      input.value = passphrase
    })

    subscribe('USE_BIP39', (/** @type {boolean} */ value) => {
      input.readOnly = value
    })
  }

  updateTranslations() {
    const { language, inputLabel } = this
    if (!language) return
    inputLabel.textContent = 'Passphrase'
  }
}

customElements.define('pass-phrase', PassPhrase)
