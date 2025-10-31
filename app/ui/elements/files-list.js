import { subscribe } from '../pubsub.js'

/** @typedef {import('../../types').FileInfo} FileInfo */

class FilesList extends HTMLElement {
  list = document.createElement('ul')
  button = document.createElement('choose-files')

  connectedCallback() {
    const { button, list } = this

    subscribe('INPUT_FILES', (/** @type {FileInfo[]} */ files) => {
      list.replaceChildren()
      for (const file of files) {
        const item = document.createElement('li')
        item.textContent = file.name
        list.appendChild(item)
      }
    })

    this.append(list, button)
  }
}

customElements.define('files-list', FilesList)
