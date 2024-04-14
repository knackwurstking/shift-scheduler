/**
 * @param {string} dataValue
 * @param {Element} element
 * @param {Element} [container]
 */
export async function replace(dataValue, element, container = null) {
  const toReplace = (container || document).querySelector(
    `[data-replace="${dataValue}"]`,
  );
  toReplace.parentElement.replaceChild(element, toReplace);
  return;
}
