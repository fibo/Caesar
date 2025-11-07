import { dispatch, subscribe } from '../state.js'

/** @typedef {import('../../types').FileInfo} FileInfo */

class FilesList extends HTMLElement {
  list = document.createElement('ul')
  chooseFilesButton = document.createElement('choose-files')
  clearListButton = document.createElement('button')

  connectedCallback() {
    const { chooseFilesButton, clearListButton, list } = this

    clearListButton.textContent = 'Clear'
    clearListButton.addEventListener('click', () => {
      dispatch({ type: 'CLEAR_INPUT_FILES' })
    })

    subscribe('INPUT_FILES', (/** @type {FileInfo[]} */ files) => {
      list.replaceChildren()
      for (const file of files) {
        const item = document.createElement('li')
        item.textContent = file.name
        list.appendChild(item)
      }
    })

    this.append(list, chooseFilesButton, clearListButton)
  }
}

customElements.define('files-list', FilesList)
