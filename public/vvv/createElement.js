export const createElement = (tag, props) => {
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
