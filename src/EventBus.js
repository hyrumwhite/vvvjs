export const eventBus = {
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
    if (options.removeWhen) {
      handler = (data) => {
        if (options.removeWhen(data)) {
          this.removeEventListener(key, handler);
        }
        return callback(data);
      };
    }
    this.handlers[key].push(handler);
    return this.removeEventListener.bind(this, key, handler);
  },
  removeEventListener(key, callback) {
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
