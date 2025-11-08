import { dispatch, subscribe } from '../state.js'

class PassPhrase extends HTMLElement {
  connectedCallback() {
    const generateButton = document.createElement('button')
    const passphraseInput = document.createElement('input')

    const bip39Checkbox = document.createElement('input')

    const numWords = document.createElement('num-words')

    const passphraseInputContainer = document.createElement('div')
    passphraseInputContainer.classList.add('input-text')
    const passphraseInputLabel = document.createElement('label')
    passphraseInputLabel.htmlFor = passphraseInput.id = 'passphrase'
    passphraseInput.type = 'text'
    passphraseInput.setAttribute('spellcheck', 'false')
    passphraseInputContainer.append(passphraseInputLabel, passphraseInput)

    const bip39CheckboxContainer = document.createElement('div')
    bip39CheckboxContainer.classList.add('input-checkbox')
    const bip39CheckboxLabel = document.createElement('label')
    bip39CheckboxLabel.htmlFor = bip39Checkbox.id = 'use-bip39'
    bip39Checkbox.type = 'checkbox'
    bip39CheckboxContainer.append(bip39Checkbox, bip39CheckboxLabel)

    this.append(
      passphraseInputContainer,
      bip39CheckboxContainer,
      generateButton,
      numWords
    )

    passphraseInput.addEventListener('blur', () => {
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

    subscribe('LANGUAGE', (_language) => {
      passphraseInputLabel.textContent = 'Passphrase'
      bip39CheckboxLabel.textContent = 'Use BIP39 Passphrase'
      generateButton.textContent = 'Generate Passphrase'
    })

    subscribe('PASSPHRASE', (/** @type {string} */ passphrase) => {
      passphraseInput.value = passphrase
    })

    subscribe('USE_BIP39', (/** @type {boolean} */ value) => {
      bip39Checkbox.checked = value
      passphraseInput.readOnly = value

      numWords.hidden = !value
      generateButton.hidden = !value
    })
  }
}

customElements.define('pass-phrase', PassPhrase)
