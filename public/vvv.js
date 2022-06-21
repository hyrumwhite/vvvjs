export const createElement = (tag, props, children) => {
  const element = document.createElement(tag);
  element.v_listeners = [];
  let parentElement = null;
  for (let prop in props) {
    let value = props[prop];
    if (prop === "parentElement") {
      parentElement = value;
    } else if (prop === "children") {
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
      element.remove();
    };
  }
  if (parentElement) {
    parentElement.appendChild(element);
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
      } else if (key === "fragment") {
        return () => document.createDocumentFragment();
      }
      return createElement.bind(null, key);
    },
  }
);

export const updateList = (list, items, { updateChild, createChild }) => {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let listItem = list.children[i];
    if (listItem && updateChild) {
      updateChild(listItem, item);
    } else if (createChild) {
      listItem = createChild(item);
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
