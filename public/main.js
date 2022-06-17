import { getEvents, eventsChanged } from "./store/localEvents.js";
import v from "./vvv";
const { div, span, textNode } = v;
import { EventList } from "/components/EventList.js";

const testDiv = div({
  textContent: "test",
  class: "test-class",
  click($event) {
    console.log($event);
  },
});

testDiv.appendChild(textNode("textnode"));
let eventList = null;
eventsChanged((events) => {
  eventList = EventList({ parent: document.body, events, eventList });
});

document.body.appendChild(testDiv);
getEvents();
// getEvents();
