/**
 * @typedef {import('../types').PubSubKey} PubSubKey
 */

/**
 * App state
 *
 * @type {Map<PubSubKey, unknown>}
 */
export const state = new Map()

/** Registry of subscribers. */
const registry = new Map()

/**
 * @param {PubSubKey} key
 * @param {unknown} value
 */
export function publish(key, value) {
  // Update state.
  state.set(key, value)
  // Notify subscribers.
  for (const callback of registry.get(key) ?? []) callback(value)
}

/**
 * @param {PubSubKey} key
 * @param {(value: unknown) => void} callback
 */
export function subscribe(key, callback) {
  // Register the subscriber.
  const subscribers = registry.get(key)
  if (subscribers) subscribers.add(callback)
  else registry.set(key, new Set([callback]))
  // Return unsubscribe function.
  return function unsubscribe() {
    const subscribers = registry.get(key)
    if (subscribers) subscribers.delete(callback)
  }
}
