import { dispatch, subscribe } from '../state.js'

class ChooseFiles extends HTMLElement {
  connectedCallback() {
    const button = document.createElement('button')

    this.append(button)

    button.addEventListener('click', () => {
      dispatch({ type: 'CHOOSE_INPUT_FILES' })
    })

    subscribe('LANGUAGE', (_language) => {
      button.textContent = 'Choose Files'
    })
  }
}

customElements.define('choose-files', ChooseFiles)
