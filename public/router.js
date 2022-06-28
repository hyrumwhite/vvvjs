const mountComponent = (component, props) => {
  const element = component(props);
  const parentElement = element.parentElement;
  if (parentElement) {
    parentElement.innerHTML = "";
    parentElement.appendChild(element);
  }
};

let routes = [];
let currentOutlet = null;
const setupRoutes = (newRoutes, outlet) => {
  currentOutlet = outlet;
  routes = newRoutes;

  window.removeEventListener("popstate", handleURLChange);
  window.addEventListener("popstate", handleURLChange);

  handleURLChange();
};

const checkForRouteMatch = (path, route) => {
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
    return null;
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

const handleURLChange = () => {
  const path = window.location.pathname;
  const queryParams = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  let matchingRoute = null;

  for (let route of routes) {
    if (route.default) {
      matchingRoute = route;
    }
    let { match, params } = checkForRouteMatch(path, route);
    params = { ...queryParams, ...params };
    if (match) {
      matchingRoute = route.component;
      break;
    }
  }

  if (matchingRoute) {
    let { component, outlet } = matchingRoute;
    outlet = outlet || currentOutlet;
    if (typeof outlet === "string") {
      outlet = document.querySelector(outlet);
    }
    currentOutlet.innerHTML = "";
    let element = component(params);
    if (element instanceof Promise) {
      element.then((element) => {
        currentOutlet.appendChild(element);
      }, params);
    } else {
      currentOutlet.appendChild(element);
    }
  }
};
