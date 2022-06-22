import { getEvents, eventsChanged } from "./store/localEvents.js";
import v from "./vvv";
const { div, button, ul } = v;
import { EventList } from "/components/EventList.js";

// let eventList = null;
// eventList = eventsChanged((events) => EventList({ events, eventList }));

div({
  parentElement: document.body,
  class: "test-class",
  children: [
    button({
      textContent: "Refresh",
      click: getEvents,
    }),
    EventList(eventsChanged),
    EventList(eventsChanged),
  ],
});
