export const createElement = (tag, props, children) => {
  const element = document.createElement(tag);
  element.v_listeners = [];
  for (let prop in props) {
    let value = props[prop];
    if (prop === "children") {
      children = value;
      children.forEach((child) => {
        if (typeof child === "string") {
          child = document.createTextNode(child);
        }
        element.appendChild(child);
      });
    } else if (typeof value === "function") {
      element.addEventListener(prop, value);
      element.v_listeners.push(value);
    } else if (prop in element) {
      element[prop] = value;
    } else {
      element.setAttribute(prop, value);
    }
    element.v_destroy = () => {
      element.v_listeners.forEach((listener) => {
        element.removeEventListener(prop, listener);
        for (let child of element.children) {
          if (child.v_destroy) {
            child.v_destroy();
          }
        }
      });
      element.parentNode?.removeChild(element);
    };
  }
  return element;
};

/**
 * @type {{[key: string]: function (): HTMLElement, textNode: function (): Text}}
 */
export default new Proxy(
  {},
  {
    get(target, key) {
      if (key === "textNode") {
        return (text) => document.createTextNode(text);
      }
      return createElement.bind(null, key);
    },
  }
);

export const Events = {
  keyId: 0,
  createEventKey(key) {
    return `${key}-${this.keyId++}`;
  },
  handlers: {},
  addEventHandler(key, callback) {
    if (!this.handlers[key]) {
      this.handlers[key] = [];
    }
    this.handlers[key].push(callback);
    return this.removeEventHandler.bind(this, key, callback);
  },
  removeEventHandler(key, callback) {
    if (this.handlers[key]) {
      this.handlers[key] = this.handlers[key].filter((cb) => cb !== callback);
    }
  },
  dispatchEvent(key, data) {
    if (this.handlers[key]) {
      this.handlers[key].forEach((cb) => cb(data));
    }
  },
};
