import { initializeRouter } from "/router.js";

const importEventsPage = async () => {
  const { EventsPage } = await import("/pages/events.js");
  return EventsPage();
};
const importDirectoryPage = async () => {
  const { DirectoryPage } = await import("/pages/directory.js");
  return DirectoryPage();
};

initializeRouter({
  outlet: "#main-outlet",
  routes: [
    {
      default: true,
      component: importDirectoryPage,
    },
    {
      name: "events-page",
      path: "/events-page",
      component: importEventsPage,
    },
  ],
});
