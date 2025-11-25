import { createHtml } from '../dom.js'
import { dispatch, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').Language} Language
 */

class CryptDirection extends HTMLElement {
  encryptInput = createHtml('input')
  encryptLabel = createHtml('label')
  encryptSpan = createHtml('span')

  decryptInput = createHtml('input')
  decryptLabel = createHtml('label')
  decryptSpan = createHtml('span')

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
      dispatch({
        type: 'SET_CRYPT_DIRECTION',
        direction: 'encrypt'
      })
    })

    decryptInput.addEventListener('change', () => {
      dispatch({
        type: 'SET_CRYPT_DIRECTION',
        direction: 'decrypt'
      })
    })

    subscribe('CRYPT_DIRECTION', (direction) => {
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
