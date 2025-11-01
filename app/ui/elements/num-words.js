import { bip39MaxNumWords, publish, subscribe } from '../state.js'

class NumWords extends HTMLElement {
  label = document.createElement('label')
  /** @type {HTMLInputElement[]} */
  selectors = []

  connectedCallback() {
    const { label } = this

    label.textContent = 'Number of words'
    const selectorContainer = document.createElement('div')
    selectorContainer.classList.add('selector-container')

    for (let i = 1; i <= bip39MaxNumWords; i++) {
      const selector = document.createElement('input')
      this.selectors.push(selector)
      selector.type = 'radio'
      selector.name = 'num-words'
      selector.value = i.toString()
      selector.addEventListener('change', this)
      selectorContainer.appendChild(selector)
    }

    subscribe('BIP39_NUM_WORDS', (numWords) => {
      this.selectors.forEach((selector) => {
        selector.checked = selector.value === numWords.toString()
      })
    })

    this.append(label, selectorContainer)
  }

  /** @param {Event} event */
  handleEvent(event) {
    if (event.type === 'change' && event.target instanceof HTMLInputElement) {
      publish('BIP39_NUM_WORDS', +event.target.value)
    }
  }
}

customElements.define('num-words', NumWords)
