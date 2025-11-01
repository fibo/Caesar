import { publish, subscribe, getState } from '../state.js'
import { generatePassphrase } from '../bib39.js'

class PassPhrase extends HTMLElement {
  generateButton = document.createElement('button')
  passphraseInput = document.createElement('input')

  bip39Checkbox = document.createElement('input')

  bip39Container = document.createElement('div')
  numWords = document.createElement('num-words')

  connectedCallback() {
    const {
      passphraseInput,
      generateButton,
      bip39Checkbox,
      bip39Container,
      numWords
    } = this

    const passphraseInputContainer = document.createElement('div')
    passphraseInputContainer.classList.add('input-text')
    const passphraseInputLabel = document.createElement('label')
    passphraseInputLabel.textContent = 'Passphrase'
    passphraseInputLabel.htmlFor = passphraseInput.id = 'passphrase'
    passphraseInput.type = 'text'
    passphraseInputContainer.append(passphraseInputLabel, passphraseInput)

    const bip39CheckboxContainer = document.createElement('div')
    bip39CheckboxContainer.classList.add('input-checkbox')
    const bip39CheckboxLabel = document.createElement('label')
    bip39CheckboxLabel.htmlFor = bip39Checkbox.id = 'use-bip39'
    bip39CheckboxLabel.textContent = 'Use BIP39 Passphrase'
    bip39Checkbox.type = 'checkbox'
    bip39CheckboxContainer.append(bip39Checkbox, bip39CheckboxLabel)

    generateButton.textContent = 'Generate Passphrase'

    bip39Container.append(numWords, generateButton)
    this.useBip39 = false

    passphraseInput.addEventListener('blur', this)
    generateButton.addEventListener('click', this)
    bip39Checkbox.addEventListener('input', this)

    subscribe('CRYPT_DIRECTION', (direction) => {
      if (direction === 'encrypt') {
        bip39Checkbox.hidden = false
        bip39CheckboxLabel.hidden = false
        generateButton.hidden = false
        numWords.hidden = false
      }
      if (direction === 'decrypt') {
        bip39Checkbox.hidden = true
        bip39CheckboxLabel.hidden = true
        generateButton.hidden = true
        numWords.hidden = true
        publish('PASSPHRASE', '')
      }
    })

    subscribe('BIP39_NUM_WORDS', () => {
      const direction = getState('CRYPT_DIRECTION')
      if (direction !== 'encrypt') return
      generatePassphrase()
    })

    subscribe('PASSPHRASE', (passphrase) => {
      if (typeof passphrase !== 'string') return
      this.passphraseInput.value = passphrase
    })

    this.append(
      passphraseInputContainer,
      bip39CheckboxContainer,
      bip39Container
    )
  }

  /** @param {Event} event */
  handleEvent(event) {
    if (event.type === 'blur' && event.target === this.passphraseInput) {
      const passphrase = this.passphraseInput.value
      publish('PASSPHRASE', passphrase)
    }

    if (event.type === 'click' && event.target === this.generateButton) {
      generatePassphrase()
    }

    if (event.type === 'input' && event.target === this.bip39Checkbox) {
      const checkbox = /** @type {HTMLInputElement} */ (event.target)
      this.useBip39 = checkbox.checked
    }
  }

  /** @param {boolean} value */
  set useBip39(value) {
    this.bip39Container.hidden = !value
    if (value) {
      generatePassphrase()
    } else {
      this.passphraseInput.value = ''
      publish('PASSPHRASE', '')
    }
  }
}

customElements.define('pass-phrase', PassPhrase)
