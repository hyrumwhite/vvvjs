export const Events = {
  keyId: 0,
  createEventKey(key) {
    return `${key}-${this.keyId++}`;
  },
  handlers: {},
  addEventListener(key, callback, options = {}) {
    if (!this.handlers[key]) {
      this.handlers[key] = [];
    }
    let handler = callback;
    if (options.destroyWhen) {
      handler = (data) => {
        if (options.destroyWhen(data)) {
          this.removeEventListener(key, handler);
        }
        return callback(data);
      };
    }
    this.handlers[key].push(handler);
    console.log(this.handlers[key].length);
    return this.removeEventListener.bind(this, key, handler);
  },
  removeEventListener(key, callback) {
    if (this.handlers[key]) {
      this.handlers[key] = this.handlers[key].filter((cb) => cb !== callback);
      console.log(this.handlers[key].length);
    }
  },
  dispatchEvent(key, data) {
    if (this.handlers[key]) {
      this.handlers[key].forEach((cb) => cb(data));
    }
  },
};
