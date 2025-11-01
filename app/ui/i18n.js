import { publish } from './pubsub.js'

/** @type {Language} */
const defaultLanguage = 'en'
/** @type {Language[]} */
const languages = [defaultLanguage, 'it']

/**
 * @typedef {import('../types').Font} Font
 * @typedef {import('../types').Language} Language
 */

/** @returns {Language} */
function detectLanguage() {
  const language = /** @type {Language} */ (navigator.language.split('-')[0])
  if (languages.includes(language)) {
    return language
  } else {
    return defaultLanguage
  }
}

const language = detectLanguage()
publish('LANGUAGE', language)
