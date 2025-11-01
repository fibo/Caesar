/**
 * @typedef {import('../types').StateKey} StateKey
 */

/**
 * App state
 *
 * @type {Map<StateKey, unknown>}
 */
const state = new Map()

export const bip39MaxNumWords = 10

/** Registry of subscribers. */
const registry = new Map()

/** * @param {StateKey} key */
export function getState(key) {
  return state.get(key)
}

/**
 * @param {StateKey} key
 * @param {unknown} value
 */
export function publish(key, value) {
  // Update state.
  state.set(key, value)
  // Notify subscribers.
  for (const callback of registry.get(key) ?? []) callback(value)
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
}
