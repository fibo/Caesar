import { dispatch, subscribe } from '../state.js'

class CryptDirection extends HTMLElement {
  connectedCallback() {
    const encryptInput = document.createElement('input')
    const decryptInput = document.createElement('input')
    encryptInput.type = decryptInput.type = 'radio'
    encryptInput.name = decryptInput.name = 'crypt-direction'

    const encryptLabel = document.createElement('label')
    const encryptSpan = document.createElement('span')
    encryptLabel.append(encryptSpan, encryptInput)

    const decryptLabel = document.createElement('label')
    const decryptSpan = document.createElement('span')
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

    subscribe('LANGUAGE', (_language) => {
      encryptSpan.textContent = 'Encrypt'
      decryptSpan.textContent = 'Decrypt'
    })
  }
}

customElements.define('crypt-direction', CryptDirection)
