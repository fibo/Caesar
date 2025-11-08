import { dispatch, subscribe } from '../state.js'

class NumWords extends HTMLElement {
  connectedCallback() {
    const maxNumWords = 10
    const label = document.createElement('label')
    /** @type {HTMLInputElement[]} */ const selectors = []

    label.textContent = 'Number of words'
    const selectorContainer = document.createElement('div')
    selectorContainer.classList.add('selector-container')

    for (let num = 1; num <= maxNumWords; num++) {
      const selector = document.createElement('input')
      selectors.push(selector)
      selector.type = 'radio'
      selector.name = 'num-words'
      selector.value = num.toString()
      selector.addEventListener('change', () => {
        dispatch({ type: 'SET_BIP39_NUM_WORDS', num })
      })
      selectorContainer.append(selector)
    }

    this.append(label, selectorContainer)

    subscribe('BIP39_NUM_WORDS', (num) => {
      selectors.forEach((selector) => {
        selector.checked = selector.value == num
      })
    })
  }
}

customElements.define('num-words', NumWords)
