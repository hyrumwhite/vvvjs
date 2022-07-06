import v from "/vvv";
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
          RouterLink({
            textContent: "resume page",
            name: "resume-page",
          }),
        ],
      }),
    ],
  });
};
