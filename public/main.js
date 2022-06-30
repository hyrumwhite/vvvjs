import { initializeRouter } from "/router.js";
// import { EventsPage } from "/pages/events.js";
import { DirectoryPage } from "/pages/directory.js";
import { DefaultLayout } from "/layouts/default.js";

const importEventsPage = async () => {
  const { EventsPage } = await import("/pages/events.js");
  return EventsPage();
};

document.body.appendChild(DefaultLayout());

initializeRouter({
  outlet: "#main-outlet",
  routes: [
    {
      default: true,
      component: DirectoryPage,
    },
    {
      name: "events-page",
      path: "/events-page",
      component: importEventsPage,
    },
  ],
});
