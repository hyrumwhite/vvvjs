import v from "/vvv";
const { div, h1 } = v;
import { RouterLink } from "/RouterLink.js";

export const DirectoryPage = () => {
	return div({
		children: [
			h1("directory"),
			RouterLink({
				textContent: "events page",
				name: "events-page",
			}),
		],
	});
};
