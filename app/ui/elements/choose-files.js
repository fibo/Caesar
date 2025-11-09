import { dispatch, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').FileInfo} FileInfo
 * @typedef {import('../../types').Language} Language
 */

class ChooseFiles extends HTMLElement {
  button = document.createElement('button')

  connectedCallback() {
    const { button } = this

    this.append(button)

    button.addEventListener('click', () => {
      dispatch({ type: 'CHOOSE_INPUT_FILES' })
    })

    subscribe('LANGUAGE', (/** @type {Language} */ language) => {
      this.language = language
      this.updateTranslations()
    })

    subscribe('INPUT_FILES', (/** @type {FileInfo[]} */ files) => {
      this.hasInputFiles = files.length > 0
      this.updateTranslations()
    })
  }

  updateTranslations() {
    const { button, language } = this
    if (!language) return

    if (this.hasInputFiles) {
      button.textContent = 'Add more Files'
    } else {
      button.textContent = 'Choose Files'
    }
  }
}

customElements.define('choose-files', ChooseFiles)
