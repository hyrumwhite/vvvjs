import { getEvents, gotEvents } from "./store/localEvents.js";
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

getEvents();

gotEvents((events) => {
	let eventList = EventList({ events });
	document.body.appendChild(eventList);
});

document.body.appendChild(testDiv);
