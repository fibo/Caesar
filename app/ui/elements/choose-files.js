import { publish } from '../pubsub.js'

class ChooseFiles extends HTMLElement {
  button = document.createElement('button')

  connectedCallback() {
    const { button } = this

    button.addEventListener('click', this)
    button.textContent = 'choose files'
    this.appendChild(button)
  }

  disconnectedCallback() {
    this.button.removeEventListener('click', this)
  }

  /** @param {Event} event */
  async handleEvent(event) {
    if (event.type === 'click') {
      const result = await window.electron.chooseFilesDialog()
      if (result.status === 'canceled') return
      if (result.status === 'error') {
        console.error(result.error)
      }
      if (result.status === 'success') {
        publish('INPUT_FILES', result.data)
      }
    }
  }
}

customElements.define('choose-files', ChooseFiles)
