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

const handleURLChange = async () => {
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
		let guardPayload = {
			route: matchingRoute,
			path,
			params,
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
		currentOutlet.innerHTML = "";
		let element = component(params);
		if (element instanceof Promise) {
			await component;
		} else {
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
export const init = ({ routes: newRoutes, outlet, guards = {} }) => {
	currentOutlet = outlet;
	routes = newRoutes;

	beforeEach = guards.beforeEach;
	afterEach = guards.afterEach;

	window.removeEventListener("popstate", handleURLChange);
	window.addEventListener("popstate", handleURLChange);

	return handleURLChange();
};

/**
 * Navigate to a given route
 * @param {{path: String, name: String, params: Object<any>, delta: number}}} param0
 * @returns undefined
 */
export const go = ({ path, name, params, query, delta }) => {
	if (delta) {
		return window.history.go(delta);
	}
	if (name) {
		let route = routes.find((route) => route.name === name);
		if (!route) {
			throw new Error(`No route found with name ${name}`);
		}
		path = route.path;
		if (params) {
			path = path.replace(/:([^/]+)/g, (match, key) => params[key]);
		}
	}
	let url = path;
	if (query) {
		url += new URLSearchParams(query).toString();
	}
	window.history.pushState({}, "", url);
	return handleURLChange();
};

export const back = (delta = -1) => go({ delta });
export const forward = (delta = 1) => go({ delta });
