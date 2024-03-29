var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/CreateElement.js
var addChildrenToElement = (element, children = []) => {
  for (let child of children) {
    if (typeof child === "string") {
      child = document.createTextNode(child);
    }
    element.appendChild(child);
  }
};
var createElement = (tag, props) => {
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
        delegatesFocus: props.delegatesFocus === true
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
var CreateElement_default = new Proxy(createElement, {
  get(target, key) {
    if (key === "textNode") {
      return (text) => document.createTextNode(text);
    }
    return createElement.bind(null, key);
  },
  apply(target, thisArg, args) {
    return target.apply(thisArg, args);
  }
});

// src/GetElement.js
var getElement = function(element, { emitInputOnValueChange = true } = {}) {
  if (typeof element === "string") {
    element = document.querySelector(element);
  }
  function selectElement(selector) {
    if (selector.startsWith("$$")) {
      let results = element.querySelectorAll(selector.substring(2));
      let elements = [];
      for (let result of results) {
        elements.push(getElement(result));
      }
      return elements;
    } else if (selector.startsWith("$")) {
      let result = element.querySelector(selector.substring(1));
      return getElement(result) || null;
    }
  }
  return new Proxy(selectElement, {
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
    }
  });
};

// src/EventBus.js
var eventBus = {
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
  }
};

// src/Router.js
var checkForRouteMatch = (path, route = "") => {
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  if (route.endsWith("/")) {
    route = route.slice(0, -1);
  }
  let routeParts = route.split("/");
  let pathParts = path.split("/");
  let params = {};
  if (routeParts.length != pathParts.length) {
    return { match: false };
  }
  for (let i = 0; i < routeParts.length; i++) {
    let routePart = routeParts[i];
    let pathPart = pathParts[i];
    if (routePart.startsWith(":")) {
      params[pathPart.slice(1)] = pathPart;
    } else if (routePart != pathPart) {
      return { match: false };
    }
  }
  return { match: true, params };
};
var handleURLChange = () => __async(void 0, null, function* () {
  const path = window.location.pathname;
  const queryParams = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  let matchingRoute = null;
  let matchingRouteParams = null;
  for (let route of routes) {
    if (route.default) {
      matchingRoute = route;
    }
    let { match, params } = checkForRouteMatch(path, route.path);
    matchingRouteParams = __spreadValues(__spreadValues({}, queryParams), params);
    if (match) {
      matchingRoute = route;
      break;
    }
  }
  if (matchingRoute) {
    let guardPayload = {
      route: matchingRoute,
      path,
      params: matchingRouteParams,
      query: queryParams
    };
    if (beforeEach) {
      yield beforeEach(guardPayload);
    }
    if (matchingRoute.before) {
      yield matchingRoute.before(guardPayload);
    }
    let { component, outlet } = matchingRoute;
    outlet = outlet || currentOutlet;
    if (typeof outlet === "string") {
      outlet = document.querySelector(outlet);
    }
    let element = component(matchingRouteParams);
    if (element instanceof Promise) {
      element = yield element;
    }
    currentOutlet.innerHTML = "";
    if (element instanceof Element) {
      currentOutlet.appendChild(element);
    }
    if (matchingRoute.after) {
      yield matchingRoute.after(guardPayload);
    }
    if (afterEach) {
      yield afterEach(guardPayload);
    }
  } else {
    console.warn('no matching route for "' + path + '"');
  }
});
var routes = [];
var currentOutlet = null;
var beforeEach = null;
var afterEach = null;
var initializeRouter = ({
  routes: newRoutes,
  outlet,
  guards = {}
}) => {
  if (typeof outlet === "string") {
    outlet = document.querySelector(outlet);
  }
  currentOutlet = outlet;
  routes = newRoutes;
  beforeEach = guards.beforeEach;
  afterEach = guards.afterEach;
  window.removeEventListener("popstate", handleURLChange);
  window.addEventListener("popstate", handleURLChange);
  return handleURLChange();
};
var addRoutes = (newRoutes) => {
  routes = [...routes, ...newRoutes];
};
var insertParamsIntoPath = (path, params) => {
  if (params) {
    path = path.replace(/:([^/]+)/g, (match, key) => params[key]);
  }
  return path;
};
var go = (arg) => {
  if (typeof arg === "string") {
    arg = { path: arg };
  }
  let { path, name, params, query, delta, replace: replace2 } = arg;
  if (delta) {
    return window.history.go(delta);
  }
  if (name) {
    let route = routes.find((route2) => route2.name === name);
    if (!route) {
      throw new Error(`No route found with name ${name}`);
    }
    path = insertParamsIntoPath(route.path, params);
  }
  let url = path;
  if (query) {
    url += new URLSearchParams(query).toString();
  }
  if (replace2) {
    window.history.replaceState(null, "", url);
  } else {
    window.history.pushState(null, "", url);
  }
  return handleURLChange();
};
var back = (delta = -1) => go({ delta });
var forward = (delta = 1) => go({ delta });
var replace = (...params) => go(__spreadValues({ replace: true }, params));
var getRoutes = () => routes;

// src/RouterLink.js
var RouterLink = (props) => {
  if (props.name) {
    let routes2 = getRoutes();
    props.to = routes2.find((route) => route.name === props.name).path;
  }
  return CreateElement_default("a", __spreadProps(__spreadValues({}, props), {
    href: insertParamsIntoPath(props.to, props.params),
    click($event) {
      var _a;
      $event.preventDefault();
      (_a = props.click) == null ? void 0 : _a.call(props, $event);
      go(props.to, props.params);
    }
  }));
};

// src/index.js
var src_default = CreateElement_default;
var createElement2 = CreateElement_default;
export {
  RouterLink,
  addRoutes,
  back,
  createElement2 as createElement,
  src_default as default,
  eventBus,
  forward,
  getElement,
  getRoutes,
  go,
  initializeRouter,
  replace
};
