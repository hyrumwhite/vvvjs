import { getEvents, eventsChanged } from "./store/localEvents.js";
import v from "./vvv";
const { div, span, textNode, button } = v;
import { EventList } from "/components/EventList.js";

const testDiv = div({
  parentElement: document.body,
  class: "test-class",
  click($event) {
    console.log($event);
  },
  children: [
    button({
      textContent: "Refresh",
      click() {
        console.log("getting events");
        getEvents();
      },
    }),
  ],
});

let eventList = null;
eventsChanged((events) => {
  eventList = EventList({ parent: document.body, events, eventList });
});
