import { initializeRouter } from "/router.js";
import { EventsPage } from "/pages/events.js";
import { DirectoryPage } from "/pages/directory.js";
import { DefaultLayout } from "/layouts/default.js";

let outlet = null;
const layout = DefaultLayout({
  body: [(outlet = document.createElement("div"))],
});
document.body.appendChild(layout);

initializeRouter({
  outlet,
  routes: [
    {
      default: true,
      component: DirectoryPage,
    },
    {
      name: "events-page",
      path: "/events-page",
      component: EventsPage,
    },
  ],
});
