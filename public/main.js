import { getEvents, gotEvents } from "./store/localEvents.js";
import v from "./vvv.js";
const { div, span, textNode } = v;
const testDiv = div({
  textContent: "test",
  class: "test-class",
  click($event) {
    console.log($event);
  },
});

testDiv.appendChild(textNode("textnode"));

getEvents();

gotEvents((events) => {
  let divs = events.map((event) => {
    let eventDiv = div({
      textContent: event.name,
    });
    testDiv.appendChild(eventDiv);
    return eventDiv;
  });
});

document.body.appendChild(testDiv);
