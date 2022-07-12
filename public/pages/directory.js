import v from "/vvv/CreateElement.js";
const { div, h1 } = v;
import { RouterLink } from "/vvv/RouterLink.js";

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
          RouterLink({
            textContent: "resume page",
            name: "resume-page",
          }),
          RouterLink({
            textContent: "todo page",
            name: "todo-page",
          }),
        ],
      }),
    ],
  });
};
