import { dispatch, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').Language} Language
 */

class NumWords extends HTMLElement {
  maxNumWords = 10

  label = document.createElement('label')
  selectorContainer = document.createElement('div')

  /** @type {HTMLInputElement[]} */ selectors = []

  connectedCallback() {
    const { maxNumWords, label, selectorContainer, selectors } = this

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

    subscribe('LANGUAGE', (/** @type {Language} */ language) => {
      this.language = language
      this.updateTranslations()
    })
  }

  updateTranslations() {
    const { language, label } = this
    if (!language) return

    label.textContent = 'Number of words'
  }
}

customElements.define('num-words', NumWords)
