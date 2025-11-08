import { dispatch, subscribe } from './state.js'

/**
 * @typedef {import('../types').LocalStorageKey} LocalStorageKey
 */

/**
 * @param {LocalStorageKey} key
 * @return {unknown}
 */
function getLocalStorateItem(key) {
  const value = localStorage.getItem(key)
  if (!value) return
  try {
    return JSON.parse(value)
  } catch (error) {
    console.error(error)
    return
  }
}

/**
 * @param {LocalStorageKey} key
 * @param {unknown} value
 */
function setLocalStorateItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function initializeStateFromLocalStorage() {
  for (const key of /** @type LocalStorageKey[] */ ([
    'BIP39_NUM_WORDS',
    'USE_BIP39'
  ])) {
    // Read value from localStorage and update state.
    const value = getLocalStorateItem(key)
    if (value !== undefined) {
      if (key === 'BIP39_NUM_WORDS')
        dispatch({
          type: 'SET_BIP39_NUM_WORDS',
          num: /** @type {number} */ (value)
        })
      if (key === 'USE_BIP39') {
        dispatch({
          type: 'SET_USE_BIP39',
          value: /** @type {boolean} */ (value)
        })
      }
    }
    // Subscribe to state changes and write to localStorage.
    subscribe(key, (/** @type {unknown} */ value) => {
      setLocalStorateItem(key, value)
    })
  }
}
