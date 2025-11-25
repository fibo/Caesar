import { createHtml } from '../dom.js'
import { dispatch, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').FileInfo} FileInfo
 * @typedef {import('../../types').Language} Language
 */

class FilesList extends HTMLElement {
  clearListButton = createHtml('button')
  chooseFilesButton = document.createElement('choose-files')
  list = createHtml('ul')
  actions = createHtml('div')

  connectedCallback() {
    const { chooseFilesButton, clearListButton, list, actions } = this

    actions.classList.add('actions')
    actions.append(chooseFilesButton, clearListButton)

    this.append(list, actions)

    clearListButton.addEventListener('click', () => {
      dispatch({ type: 'CLEAR_INPUT_FILES' })
    })

    subscribe('LANGUAGE', (language) => {
      this.language = language
      this.updateTranslations()
    })

    subscribe('INPUT_FILES', (/** @type {FileInfo[]} */ files) => {
      clearListButton.hidden = files.length === 0

      // Update files list.
      list.replaceChildren()
      for (const file of files) {
        const item = createHtml('li')
        item.textContent = file.name
        list.appendChild(item)
      }
    })
  }

  updateTranslations() {
    const { language, clearListButton } = this
    if (!language) return

    clearListButton.textContent = 'Clear'
  }
}

customElements.define('files-list', FilesList)
