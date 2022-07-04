import { initializeRouter } from "/router.js";
import v from "/vvv";
const { img, div, style } = v;
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

div({
  parentElement: document.body,
  class: "row justify-center",
  children: [
    img({
      style: { width: "100px" },
      parentElement: document.body,
      src: `/images/seth.svg`,
      alt: "Picture of a person",
    }),
  ],
  shadowChildren: [
    style(`
      /*create a keyframe to infinitely rotate*/
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      /*create a class to use the keyframe*/
      .rotate {
        transform-origin: center 42%;
        animation: rotate infinite 2s linear;
      }
      img {
        width: 100px;
      }
    `),
    img({
      class: "rotate",
      parentElement: document.body,
      src: `/images/seth.svg`,
      alt: "Picture of a person",
    }),
  ],
});

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
  ],
});
