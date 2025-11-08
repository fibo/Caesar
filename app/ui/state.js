import { generatePassphrase } from './BIP39.js'

/**
 * @typedef {import('../types').Action} Action
 * @typedef {import('../types').CryptDirection} CryptDirection
 * @typedef {import('../types').FileInfo} FileInfo
 * @typedef {import('../types').StateKey} StateKey
 */

/**
 * App state
 *
 * @type {Map<StateKey, unknown>}
 */
const state = new Map()

/** Registry of subscribers. */
const registry = new Map()

/**
 * @param {StateKey} key
 * @param {unknown} value
 */
function publish(key, value) {
  // Update state.
  state.set(key, value)
  // Notify subscribers.
  for (const callback of registry.get(key) ?? []) callback(value)
}

/** * @param {Action} action */
export async function dispatch(action) {
  if (action.type === 'CHOOSE_INPUT_FILES') {
    const result = await window.electron.chooseFilesDialog()
    if (result.status === 'canceled') return
    if (result.status === 'error') {
      console.error(result.error)
    }
    if (result.status === 'success') {
      const inputFiles =
        /** @type {FileInfo[]} */ (state.get('INPUT_FILES')) || []
      publish('INPUT_FILES', [...inputFiles, ...result.data])
    }
  }

  if (action.type === 'CLEAR_PASSPHRASE') {
    publish('PASSPHRASE', '')
  }

  if (action.type === 'CLEAR_INPUT_FILES') {
    publish('INPUT_FILES', [])
  }

  if (action.type === 'CREATE_OUTPUT_FILES') {
    const passphrase = /** @type {string} */ (state.get('PASSPHRASE'))
    if (!passphrase) return
    const files = /** @type {FileInfo[]} */ (state.get('INPUT_FILES'))
    if (files.length === 0) return
    const direction = /** @type {CryptDirection} */ (
      state.get('CRYPT_DIRECTION')
    )
    if (direction === 'encrypt') {
      window.electron.encryptWithPassphrase(passphrase, files)
    }
    if (direction === 'decrypt') {
      window.electron.decryptWithPassphrase(passphrase, files)
    }
    publish('INPUT_FILES', [])
  }

  if (action.type === 'GENERATE_BIP39_WORDS') {
    const numWords = /** @type {number} */ (state.get('BIP39_NUM_WORDS'))
    const passphrase = generatePassphrase(numWords)
    publish('PASSPHRASE', passphrase)
  }

  if (action.type === 'SET_BIP39_NUM_WORDS') {
    publish('BIP39_NUM_WORDS', action.num)
    const useBip39 = /** @type {boolean} */ (state.get('USE_BIP39'))
    if (useBip39) {
      dispatch({ type: 'GENERATE_BIP39_WORDS' })
    }
  }

  if (action.type === 'SET_CRYPT_DIRECTION') {
    publish('CRYPT_DIRECTION', action.direction)
    publish('INPUT_FILES', '')
    if (action.direction === 'encrypt') {
      if (state.get('USE_BIP39') && !state.get('PASSPHRASE'))
        dispatch({ type: 'GENERATE_BIP39_WORDS' })
    }
  }

  if (action.type === 'SET_LANGUAGE') {
    publish('LANGUAGE', action.language)
  }

  if (action.type === 'SET_USE_BIP39') {
    publish('USE_BIP39', action.value)
    if (action.value) {
      dispatch({ type: 'GENERATE_BIP39_WORDS' })
    } else {
      publish('PASSPHRASE', '')
    }
  }
}

/**
 * @param {StateKey} key
 * @param {(value: unknown) => void} callback
 */
export function subscribe(key, callback) {
  // Register the subscriber.
  const subscribers = registry.get(key)
  if (subscribers) subscribers.add(callback)
  else registry.set(key, new Set([callback]))
  // Send current state to the new subscriber.
  if (state.has(key)) callback(state.get(key))
  // Return unsubscribe function.
  return function unsubscribe() {
    const subscribers = registry.get(key)
    if (subscribers) subscribers.delete(callback)
  }
}

export function initializeStateDefaults() {
  publish('BIP39_NUM_WORDS', 1)
  publish('CRYPT_DIRECTION', 'encrypt')
  publish('INPUT_FILES', [])
}
