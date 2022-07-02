//define a type where keys that start with $ are HTML elements
/**
 * @typedef {`\$${string}`} StartsWithDollarSign
 */
/**
 * @typedef {`\$\$${string}`} StartsWithDollarSigns
 */
/**
 * @typedef {HTMLElement & {[key: StartsWithDollarSign]: HtmlElementProxy, [key: StartsWithDollarSigns]: HtmlElementProxy[]}} HtmlElementProxy
 */

/**
 *
 * @param {HTMLElement} element
 * @param {{emitInputOnValueChange: Boolean}} options
 * @returns {HtmlElementProxy}
 */
export const ErgoElement = function (
  element,
  { emitInputOnValueChange = true } = {}
) {
  if (typeof element === "string") {
    element = document.querySelector(element);
  }

  function getElement(selector) {
    if (selector.startsWith("$$")) {
      let results = element.querySelectorAll(selector.substring(2));
      let elements = [];
      for (let result of results) {
        elements.push(ErgoElement(result));
      }
      return elements;
    } else if (selector.startsWith("$")) {
      let result = element.querySelector(selector.substring(1));
      return ErgoElement(result) || null;
    }
  }

  return new Proxy(getElement, {
    get(target, prop, receiver) {
      let value = element[prop];
      if (prop === "$el") {
        return element;
      } else if (typeof value === "function") {
        return value.bind(element);
      } else if (prop in element) {
        return element[prop];
      } else if (prop.startsWith("$")) {
        return target(prop);
      }
    },
    set(target, prop, value) {
      element[prop] = value;
      if (prop === "value" && emitInputOnValueChange) {
        element.dispatchEvent(new CustomEvent("input", { detail: value }));
      }
      return true;
    },
    apply(target, thisArg, args) {
      return target.apply(thisArg, args);
    },
  });
};
