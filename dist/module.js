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
    } else if (prop === "shadowHost") {
      if (typeof value === "string") {
        value = document.querySelector(value);
      }
      parentElement = value.attachShadow({
        mode: "open",
        delegatesFocus: value.getAttribute("delegates-focus") === "true"
      });
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
      element.addEventListener(prop, value);
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
var handleURLChange = async () => {
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
    matchingRouteParams = { ...queryParams, ...params };
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
      await beforeEach(guardPayload);
    }
    if (matchingRoute.before) {
      await matchingRoute.before(guardPayload);
    }
    let { component, outlet } = matchingRoute;
    outlet = outlet || currentOutlet;
    if (typeof outlet === "string") {
      outlet = document.querySelector(outlet);
    }
    let element = component(matchingRouteParams);
    if (element instanceof Promise) {
      element = await element;
    }
    currentOutlet.innerHTML = "";
    if (element instanceof Element) {
      currentOutlet.appendChild(element);
    }
    if (matchingRoute.after) {
      await matchingRoute.after(guardPayload);
    }
    if (afterEach) {
      await afterEach(guardPayload);
    }
  } else {
    console.warn('no matching route for "' + path + '"');
  }
};
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
var replace = (...params) => go({ replace: true, ...params });
var getRoutes = () => routes;

// src/RouterLink.js
var RouterLink = (props) => {
  if (props.name) {
    let routes2 = getRoutes();
    props.to = routes2.find((route) => route.name === props.name).path;
  }
  return CreateElement_default("a", {
    ...props,
    href: insertParamsIntoPath(props.to, props.params),
    click($event) {
      $event.preventDefault();
      props.click?.($event);
      go(props.to, props.params);
    }
  });
};

// src/index.js
var createElement2 = CreateElement_default;
export {
  RouterLink,
  addRoutes,
  back,
  createElement2 as createElement,
  eventBus,
  forward,
  getElement,
  getRoutes,
  go,
  initializeRouter,
  replace
};
