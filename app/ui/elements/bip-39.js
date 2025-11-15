import { dispatch, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').Language} Language
 */

class Bip39 extends HTMLElement {
  checkbox = document.createElement('input')
  checkboxContainer = document.createElement('div')
  checkboxLabel = document.createElement('label')
  generateButton = document.createElement('button')
  numWords = document.createElement('num-words')

  connectedCallback() {
    const {
      generateButton,
      checkbox,
      checkboxContainer,
      checkboxLabel,
      numWords
    } = this

    checkboxContainer.classList.add('input-checkbox')
    checkboxLabel.htmlFor = checkbox.id = 'use-bip39'
    checkbox.type = 'checkbox'
    checkboxContainer.append(checkbox, checkboxLabel)

    this.append(checkboxContainer, numWords, generateButton)

    checkbox.addEventListener('input', () => {
      dispatch({ type: 'SET_USE_BIP39', value: checkbox.checked })
    })

    generateButton.addEventListener('click', () => {
      dispatch({ type: 'GENERATE_BIP39_WORDS' })
    })

    subscribe('CRYPT_DIRECTION', (direction) => {
      if (direction === 'encrypt') {
        checkbox.hidden = false
        checkboxLabel.hidden = false
        if (checkbox.checked) {
          generateButton.hidden = false
          numWords.hidden = false
        }
      }
      if (direction === 'decrypt') {
        checkbox.hidden = true
        checkboxLabel.hidden = true
        generateButton.hidden = true
        numWords.hidden = true
      }
    })

    subscribe('USE_BIP39', (/** @type {boolean} */ value) => {
      checkbox.checked = value
      // Need to set attribute for CSS :checked selector
      if (value) {
        checkbox.setAttribute('checked', '')
      } else {
        checkbox.removeAttribute('checked')
      }

      numWords.hidden = !value
      generateButton.hidden = !value
    })

    subscribe('LANGUAGE', (/** @type {Language} */ language) => {
      this.language = language
      this.updateTranslations()
    })
  }

  updateTranslations() {
    const { language, generateButton, checkboxLabel } = this
    if (!language) return
    checkboxLabel.textContent = 'Use BIP39 Passphrase'
    generateButton.textContent = 'Generate Passphrase'
  }
}

customElements.define('bip-39', Bip39)
