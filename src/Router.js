/**
 * @typedef {string | HTMLElement} Outlet
 */

/**
 * @typedef {{path: 'String', name: 'string', component: Promise | function(): HTMLElement, outlet: Outlet}} Route
 */

/**
 *
 * @typedef {function(): Promise | undefined} GuardFunction
 */

const checkForRouteMatch = (path, route = "") => {
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

const handleURLChange = async () => {
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
      query: queryParams,
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

/**
 * @type {Route[]}
 */
let routes = [];

/**
 * @type {Outlet}
 */
let currentOutlet = null;

let beforeEach = null;
let afterEach = null;

/**
 * Initialize the router.
 * @param {{
 * 	routes: Array<Route>,
 * 	outlet: Outlet,
 * 	guards: {beforeEach: GuardFunction, afterEach: GuardFunction}
 * }} param0
 */
export const initializeRouter = ({
  routes: newRoutes,
  outlet,
  guards = {},
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
/**
 * add a route to the router after setup
 * @param {Route[]} newRoutes
 */
export const addRoutes = (newRoutes) => {
  routes = [...routes, ...newRoutes];
};

export const insertParamsIntoPath = (path, params) => {
  if (params) {
    path = path.replace(/:([^/]+)/g, (match, key) => params[key]);
  }
  return path;
};

/**
 * Navigate to a given route
 * @param {{path: String, name: String, params: Object<any>, delta: number} | string} param0
 * @returns undefined
 */
export const go = (arg) => {
  if (typeof arg === "string") {
    arg = { path: arg };
  }
  let { path, name, params, query, delta, replace } = arg;
  if (delta) {
    return window.history.go(delta);
  }
  if (name) {
    let route = routes.find((route) => route.name === name);
    if (!route) {
      throw new Error(`No route found with name ${name}`);
    }
    path = insertParamsIntoPath(route.path, params);
  }
  let url = path;
  if (query) {
    url += new URLSearchParams(query).toString();
  }
  if (replace) {
    window.history.replaceState(null, "", url);
  } else {
    window.history.pushState(null, "", url);
  }
  return handleURLChange();
};

export const back = (delta = -1) => go({ delta });
export const forward = (delta = 1) => go({ delta });
export const replace = (...params) => go({ replace: true, ...params });
export const getRoutes = () => routes;

//TODO: add replace
