import { initializeRouter } from "/vvv/Router.js";

const importEventsPage = async () => {
  const { EventsPage } = await import("/pages/events.js");
  return EventsPage();
};
const importDirectoryPage = async () => {
  const { DirectoryPage } = await import("/pages/directory.js");
  return DirectoryPage();
};
const importShadowPage = async () => {
  const { ShadowPage } = await import("/pages/shadow.js");
  return ShadowPage();
};
const importResumePage = async () => {
  const { ResumePage } = await import("/pages/resume.js");
  return ResumePage();
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
    {
      name: "shadow-page",
      path: "/shadow-page",
      component: importShadowPage,
    },
    {
      name: "resume-page",
      path: "/resume-page",
      component: importResumePage,
    },
  ],
});
