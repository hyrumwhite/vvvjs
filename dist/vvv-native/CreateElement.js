const addChildrenToElement = (element, children = []) => {
  for (let child of children) {
    if (typeof child === "string") {
      child = document.createTextNode(child);
    }
    element.appendChild(child);
  }
};
/**
 * @typedef {import('./html-tag-type').HTMLElementOptions} HTMLElementOptions
 */

/**
 * @typedef {function(import('./html-tag-type').HTMLNodeName, HTMLElementOptions): HTMLElement} CreateElement
 */

/**
 * Create an element from a string and given properties
 * @type {CreateElement}
 */
export const createElement = (tag, props) => {
  let element = null;
  if (tag instanceof Element) {
    element = tag;
  } else if (tag == "fragment") {
    element = document.createDocumentFragment();
  } else {
    element = document.createElement(tag);
  }

  element.v_listeners = [];

  let parentElement = null;

  //format params based on types
  if (typeof props == "string") {
    props = { textContent: props };
  }
  if (props instanceof Array) {
    props = { children: props };
  }

  for (let prop in props) {
    let value = props[prop];
    if (prop === "parentElement") {
      if (typeof value === "string") {
        value = document.querySelector(value);
      }
      parentElement = value;
    } else if (prop === "defineProperties") {
      Object.defineProperties(element, value);
    } else if (prop === "style" && typeof value == "object") {
      Object.assign(element.style, value);
    } else if (prop === "children") {
      addChildrenToElement(element, value);
    } else if (prop === "shadowChildren") {
      let shadowRoot = element.attachShadow({
        mode: "open",
        delegatesFocus: props.delegatesFocus === true,
      });
      addChildrenToElement(shadowRoot, value);
    } else if (typeof value === "function") {
      let [eventName, ...options] = prop.split(".");
      let eventOptions = {};
      for (let option of options) {
        eventOptions[option] = true;
      }
      element.addEventListener(
        eventName,
        value,
        eventOptions,
        options.includes("capture")
      );
      element.v_listeners.push({ prop, listener: value });
    } else if (prop in element) {
      element[prop] = value;
    } else {
      element.setAttribute(prop, value);
    }
  }
  element.v_destroy = () => {
    if (element.v_listeners) {
      for (let { prop, listener } of element.v_listeners) {
        element.removeEventListener(prop, listener);
        for (let child of element.children) {
          if (child.v_destroy) {
            child.v_destroy();
          }
        }
      }
    }
    element.remove();
  };
  if (parentElement) {
    parentElement.appendChild(element);
  }
  return element;
};

/**
 * @type {{[key: string]: function (): HTMLElement, textNode: function (): Text} | CreateElement}
 */
export default new Proxy(createElement, {
  get(target, key) {
    if (key === "textNode") {
      return (text) => document.createTextNode(text);
    }
    return createElement.bind(null, key);
  },
  apply(target, thisArg, args) {
    return target.apply(thisArg, args);
  },
});

export const updateList = (list, items, { updateChild, createChild }) => {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let listItem = list.children[i];
    if (listItem && updateChild) {
      updateChild(listItem, item, i);
    } else if (createChild) {
      listItem = createChild(item, i);
      list.appendChild(listItem);
    }
  }
  //remove excess items
  for (let i = list.children.length - 1; i >= items.length; i--) {
    let child = list.children[i];
    if (child.v_destroy) {
      child.v_destroy();
    } else {
      child.remove();
    }
  }
  return list;
};
