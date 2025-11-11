import { dispatch, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').Language} Language
 */

class PassPhrase extends HTMLElement {
  generateButton = document.createElement('button')
  passphraseInput = document.createElement('input')
  passphraseInputContainer = document.createElement('div')
  passphraseInputLabel = document.createElement('label')

  bip39Checkbox = document.createElement('input')
  bip39CheckboxContainer = document.createElement('div')
  bip39CheckboxLabel = document.createElement('label')

  numWords = document.createElement('num-words')

  connectedCallback() {
    const {
      generateButton,
      passphraseInput,
      passphraseInputContainer,
      passphraseInputLabel,
      bip39Checkbox,
      bip39CheckboxContainer,
      bip39CheckboxLabel,
      numWords
    } = this

    passphraseInputContainer.classList.add('input-text')
    passphraseInputLabel.htmlFor = passphraseInput.id = 'passphrase'
    passphraseInput.type = 'text'
    passphraseInput.setAttribute('spellcheck', 'false')
    passphraseInputContainer.append(passphraseInputLabel, passphraseInput)

    bip39CheckboxContainer.classList.add('input-checkbox')
    bip39CheckboxLabel.htmlFor = bip39Checkbox.id = 'use-bip39'
    bip39Checkbox.type = 'checkbox'
    bip39CheckboxContainer.append(bip39Checkbox, bip39CheckboxLabel)

    this.append(
      passphraseInputContainer,
      bip39CheckboxContainer,
      numWords,
      generateButton
    )

    passphraseInput.addEventListener('input', () => {
      dispatch({ type: 'SET_PASSPHRASE', passphrase: passphraseInput.value })
    })

    generateButton.addEventListener('click', () => {
      dispatch({ type: 'GENERATE_BIP39_WORDS' })
    })

    bip39Checkbox.addEventListener('input', () => {
      dispatch({ type: 'SET_USE_BIP39', value: bip39Checkbox.checked })
    })

    subscribe('CRYPT_DIRECTION', (direction) => {
      if (direction === 'encrypt') {
        bip39Checkbox.hidden = false
        bip39CheckboxLabel.hidden = false
        if (bip39Checkbox.checked) {
          generateButton.hidden = false
          numWords.hidden = false
          passphraseInput.readOnly = true
        }
      }
      if (direction === 'decrypt') {
        bip39Checkbox.hidden = true
        bip39CheckboxLabel.hidden = true
        generateButton.hidden = true
        numWords.hidden = true
        passphraseInput.readOnly = false
      }
    })

    subscribe('LANGUAGE', (/** @type {Language} */ language) => {
      this.language = language
      this.updateTranslations()
    })

    subscribe('PASSPHRASE', (/** @type {string} */ passphrase) => {
      passphraseInput.value = passphrase
    })

    subscribe('USE_BIP39', (/** @type {boolean} */ value) => {
      bip39Checkbox.checked = value
      // Need to set attribute for CSS :checked selector
      if (value) {
        bip39Checkbox.setAttribute('checked', '')
      } else {
        bip39Checkbox.removeAttribute('checked')
      }

      passphraseInput.readOnly = value

      numWords.hidden = !value
      generateButton.hidden = !value
    })
  }

  updateTranslations() {
    const {
      language,
      passphraseInputLabel,
      generateButton,
      bip39CheckboxLabel
    } = this
    if (!language) return
    passphraseInputLabel.textContent = 'Passphrase'
    bip39CheckboxLabel.textContent = 'Use BIP39 Passphrase'
    generateButton.textContent = 'Generate Passphrase'
  }
}

customElements.define('pass-phrase', PassPhrase)
