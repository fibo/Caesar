import { generatePassphrase } from './BIP39.js'

/**
 * @typedef {import('../types').Action} Action
 * @typedef {import('../types').CryptDirection} CryptDirection
 * @typedef {import('../types').FileInfo} FileInfo
 * @typedef {import('../types').State} State
 * @typedef {import('../types').StateKey} StateKey
 */

/**
 * App state
 *
 * @type {Map<StateKey>}
 */
const state = new Map()

/**
 * Get a copy of the state value for the given key.
 *
 * @template Key
 * @param {Key extends StateKey ? Key : never} key
 * @returns {State[Key]}
 */
const getState = (key) =>
  // Use structuredClone to avoid unexpected state mutations.
  structuredClone(state.get(key))

/** Registry of subscribers. */
const registry = new Map()

/**
 * @param {StateKey} key
 * @param {State[StateKey]} value
 */
function publish(key, value) {
  // Update state.
  state.set(key, value)
  // Notify subscribers.
  for (const callback of registry.get(key) ?? []) callback(value)
}

/**
 * @param {Action} action
 */
export async function dispatch(action) {
  if (action.type === 'CHOOSE_INPUT_FILES') {
    const result = await window.electron.chooseFilesDialog()
    if (result.status === 'canceled') return
    if (result.status === 'error') console.error(result.error)
    if (result.status === 'success') {
      const inputFiles = getState('INPUT_FILES')
      // Avoid duplicates.
      for (const file of result.data)
        if (inputFiles.find((item) => item.id === file.id)) {
          // If file is already in the INPUT_FILES list, skip it.
          continue
        } else {
          inputFiles.push(file)
        }
      publish('INPUT_FILES', inputFiles)
    }
  }

  if (action.type === 'CLEAR_PASSPHRASE') {
    publish('PASSPHRASE', '')
  }

  if (action.type === 'CLEAR_INPUT_FILES') {
    publish('INPUT_FILES', [])
  }

  if (action.type === 'CREATE_OUTPUT_FILES') {
    const passphrase = getState('PASSPHRASE')
    if (!passphrase) return
    const files = getState('INPUT_FILES')
    if (files.length === 0) return
    const direction = getState('CRYPT_DIRECTION')
    if (direction === 'encrypt') {
      window.electron.encryptWithPassphrase(passphrase, files)
    }
    if (direction === 'decrypt') {
      window.electron.decryptWithPassphrase(passphrase, files)
    }
    publish('INPUT_FILES', [])
  }

  if (action.type === 'FONT_LOADED') {
    const initialized = getState('INITIALIZED')
    if (!initialized) {
      publish('INITIALIZED', true)

      // Remove splash screen.
      const splashScreen = document.getElementById('splash-screen')
      const start = +splashScreen.dataset.start
      const minSplashTime = 1771 + Math.floor(Math.random() * 1771)
      setTimeout(
        () => {
          splashScreen.remove()
        },
        Math.max(0, minSplashTime - (performance.now() - start))
      )
    }
  }

  if (action.type === 'GENERATE_BIP39_WORDS') {
    const numWords = getState('BIP39_NUM_WORDS')
    publish('PASSPHRASE', generatePassphrase(numWords))
  }

  if (action.type === 'SET_BIP39_NUM_WORDS') {
    publish('BIP39_NUM_WORDS', action.num)
    if (getState('USE_BIP39')) {
      dispatch({ type: 'GENERATE_BIP39_WORDS' })
    }
  }

  if (action.type === 'SET_CRYPT_DIRECTION') {
    publish('CRYPT_DIRECTION', action.direction)
    publish('INPUT_FILES', '')
    if (action.direction === 'encrypt') {
      if (getState('USE_BIP39') && !getState('PASSPHRASE'))
        dispatch({ type: 'GENERATE_BIP39_WORDS' })
    }
  }

  if (action.type === 'SET_LANGUAGE') {
    publish('LANGUAGE', action.language)
  }

  if (action.type === 'SET_PASSPHRASE') {
    publish('PASSPHRASE', action.passphrase)
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
 * @param {(value: State[StateKey]) => void} callback
 */
export function subscribe(key, callback) {
  // Register the subscriber.
  const subscribers = registry.get(key)
  if (subscribers) subscribers.add(callback)
  else registry.set(key, new Set([callback]))
  // Send current state to the new subscriber.
  if (state.has(key)) callback(getState(key))
  // Return unsubscribe function.
  return function unsubscribe() {
    const subscribers = registry.get(key)
    if (subscribers) subscribers.delete(callback)
  }
}

export function initializeStateDefaults() {
  publish('USE_BIP39', false)
  publish('BIP39_NUM_WORDS', 1)
  publish('CRYPT_DIRECTION', 'encrypt')
  publish('INPUT_FILES', [])
}
