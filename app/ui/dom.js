/**
 * @template {keyof HTMLElementTagNameMap} T
 * @param {T} tag
 * @param {(Record<string, string> | null)=} attributes
 * @param {Array<number | string | HTMLElement>=} children
 * @returns {HTMLElementTagNameMap[T]}
 */
export function createHtml(tag, attributes = null, children = []) {
  const element = document.createElement(tag)
  if (attributes)
    for (const [key, value] of Object.entries(attributes))
      element.setAttribute(key, value)
  for (const child of children)
    if (typeof child === 'number' || typeof child === 'string')
      element.appendChild(document.createTextNode(child.toString()))
  return element
}
