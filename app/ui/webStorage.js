import { dispatch, subscribe } from './state.js'

/**
 * @typedef {import('../types').Action} Action
 * @typedef {import('../types').LocalStorageKey} LocalStorageKey
 * @typedef {import('../types').JsonValue} JsonValue
 * @typedef {import('../types').WebStorageActionMapper} WebStorageActionMapper
 */

const actionMappers = /** @type {WebStorageActionMapper[]} */ ([
  {
    key: 'BIP39_NUM_WORDS',
    action: (data) => ({ type: 'SET_BIP39_NUM_WORDS', num: data })
  },
  {
    key: 'USE_BIP39',
    action: (data) => ({ type: 'SET_USE_BIP39', value: data })
  }
])

export function initializeStateFromLocalStorage() {
  for (const { key, action } of actionMappers) {
    // Read value from localStorage and update state.
    const value = localStorage.getItem(key)
    if (value !== undefined) {
      try {
        const data = /** @type {JsonValue} */ (JSON.parse(value))
        dispatch(action(data))
      } catch (error) {
        localStorage.removeItem(key)
        console.error(error)
        return undefined
      }
    }
    // Subscribe to state changes and write to localStorage.
    subscribe(key, (value) => {
      try {
        const data = JSON.stringify(value)
        localStorage.setItem(key, data)
      } catch (error) {
        console.error(error)
      }
    })
  }
}
