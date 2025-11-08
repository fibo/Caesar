import { dispatch, subscribe } from '../state.js'

/** @typedef {import('../../types').FileInfo} FileInfo */

class FilesList extends HTMLElement {
  connectedCallback() {
    const list = document.createElement('ul')
    const chooseFilesButton = document.createElement('choose-files')
    const clearListButton = document.createElement('button')

    const actions = document.createElement('div')
    actions.classList.add('actions')
    actions.append(chooseFilesButton, clearListButton)

    this.append(list, actions)

    clearListButton.addEventListener('click', () => {
      dispatch({ type: 'CLEAR_INPUT_FILES' })
    })

    subscribe('LANGUAGE', (_language) => {
      clearListButton.textContent = 'Clear'
    })

    subscribe('INPUT_FILES', (/** @type {FileInfo[]} */ files) => {
      clearListButton.hidden = files.length === 0

      list.replaceChildren()

      for (const file of files) {
        const item = document.createElement('li')
        item.textContent = file.name
        list.appendChild(item)
      }
    })
  }
}

customElements.define('files-list', FilesList)
