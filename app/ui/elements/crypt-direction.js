import { dispatch, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').Language} Language
 */

class CryptDirection extends HTMLElement {
  encryptInput = document.createElement('input')
  encryptLabel = document.createElement('label')
  encryptSpan = document.createElement('span')

  decryptInput = document.createElement('input')
  decryptLabel = document.createElement('label')
  decryptSpan = document.createElement('span')

  connectedCallback() {
    const {
      encryptInput,
      encryptLabel,
      encryptSpan,
      decryptInput,
      decryptLabel,
      decryptSpan
    } = this

    encryptInput.type = decryptInput.type = 'radio'
    encryptInput.name = decryptInput.name = 'crypt-direction'

    encryptLabel.append(encryptSpan, encryptInput)

    decryptLabel.append(decryptSpan, decryptInput)

    this.append(encryptLabel, decryptLabel)

    encryptInput.addEventListener('change', () => {
      console.log('change to encrypt')
      dispatch({
        type: 'SET_CRYPT_DIRECTION',
        direction: 'encrypt'
      })
    })

    decryptInput.addEventListener('change', () => {
      console.log('change to decrypt')
      dispatch({
        type: 'SET_CRYPT_DIRECTION',
        direction: 'decrypt'
      })
    })

    subscribe('CRYPT_DIRECTION', (direction) => {
      console.log('xx', direction)
      if (direction === 'encrypt') {
        encryptInput.setAttribute('checked', '')
        decryptInput.removeAttribute('checked')
      } else if (direction === 'decrypt') {
        decryptInput.setAttribute('checked', '')
        encryptInput.removeAttribute('checked')
      }
    })

    subscribe('LANGUAGE', (language) => {
      this.language = language
      this.updateTranslations()
    })
  }

  updateTranslations() {
    const { language, encryptSpan, decryptSpan } = this
    if (!language) return

    encryptSpan.textContent = 'Encrypt'
    decryptSpan.textContent = 'Decrypt'
  }
}

customElements.define('crypt-direction', CryptDirection)
