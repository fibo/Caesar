import { dispatch, subscribe } from '../state.js'

/**
 * @typedef {import('../../types').Font} Font
 * @typedef {import('../../types').Language} Language
 */

/** @type {Font} */
const defaultFont = {
  family: 'Noto Sans',
  file: 'NotoSans-VariableFont_wdth,wght.ttf',
  languages: ['en', 'it']
}
/** @type {Font[]} */
const fonts = [defaultFont]

/**
 * Load fonts and then show the app.
 *
 * @example
 * <font-loader hidden>
 *   <!-- App content -->
 * </font-loader>
 */
class FontLoader extends HTMLElement {
  connectedCallback() {
    subscribe('LANGUAGE', (/** @type {Language} */ language) => {
      this.loadFont(language)
    })
  }

  /** @param {Language} language */
  async loadFont(language) {
    const font =
      fonts.find((font) => font.languages.includes(language)) || defaultFont
    const fontFace = new FontFace(
      font.family,
      `url(./assets/fonts/${font.file})`,
      {
        style: 'normal',
        weight: '100 900'
      }
    )
    fontFace
      .load()
      .then((font) => {
        document.fonts.add(font)
        document.body.style.fontFamily = font.family
        dispatch({ type: 'FONT_LOADED' })
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        this.hidden = false
      })
  }
}

customElements.define('font-loader', FontLoader)
