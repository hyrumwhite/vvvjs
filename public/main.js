import { getEvents, eventsChanged } from "./store/localEvents.js";
import v from "./vvv";
const { div, span, textNode, button } = v;
import { EventList } from "/components/EventList.js";

div({
	parentElement: document.body,
	class: "test-class",
	children: [
		button({
			textContent: "Refresh",
			click: getEvents,
		}),
	],
});

let eventList = null;
eventsChanged((events) => {
	eventList = EventList({ parent: document.body, events, eventList });
});
