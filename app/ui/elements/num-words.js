import { createHtml } from '../dom.js'
import { dispatch, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').Language} Language
 */

export class NumWords extends HTMLElement {
  maxNumWords = 10

  label = createHtml('label')
  selectorContainer = createHtml('div')

  /** @type {HTMLInputElement[]} */ selectors = []

  connectedCallback() {
    const { maxNumWords, label, selectorContainer, selectors } = this

    selectorContainer.classList.add('selector-container')

    for (let num = 1; num <= maxNumWords; num++) {
      const selector = createHtml('input', {
        type: 'radio',
        name: 'num-words',
        value: num.toString()
      })
      selectors.push(selector)
      selector.addEventListener('change', () => {
        dispatch({ type: 'SET_BIP39_NUM_WORDS', num })
      })
      selectorContainer.append(selector)
    }

    this.append(label, selectorContainer)

    subscribe('BIP39_NUM_WORDS', (num) => {
      let aboveChecked = false
      selectors.forEach((selector) => {
        const checked = selector.value == num
        selector.checked = checked
        if (checked) selector.setAttribute('checked', '')
        else selector.removeAttribute('checked')
        selector.dataset.above = aboveChecked.toString()
        if (checked) aboveChecked = true
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
