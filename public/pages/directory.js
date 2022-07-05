import v from "/vvv.js";
const { div, h1 } = v;
import { RouterLink } from "/RouterLink.js";

export const DirectoryPage = () => {
	return div({
		children: [
			h1("directory"),
			div({
				class: "column",
				children: [
					RouterLink({
						textContent: "events page",
						name: "events-page",
					}),
					RouterLink({
						textContent: "shadow page",
						name: "shadow-page",
					}),
				],
			}),
		],
	});
};
