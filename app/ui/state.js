/**
 * @typedef {import('../types').Action} Action
 * @typedef {import('../types').CryptDirection} CryptDirection
 * @typedef {import('../types').FileInfo} FileInfo
 * @typedef {import('../types').Reducer} Reducer
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
export const getState = (key) =>
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

/** @type {Set<Reducer>} */
const reducers = new Set()

/**
 * @param {Reducer} handler
 * @return {() => void} unregister handler
 */
export function reducer(handler) {
  reducers.add(handler)
  return () => {
    reducers.delete(handler)
  }
}

/**
 * @param {Action} action
 */
export async function dispatch(action) {
  for (const reducer of reducers) {
    const result = await reducer(action)

    for (const [key, value] of Object.entries(result || {})) {
      publish(/** @type {StateKey} */ (key), value)
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
