import {
	getEvents,
	eventsChanged,
	state as EventState,
} from "/store/localEvents.js";

import v from "/vvv";
const { div, button, output } = v;
import { EventList } from "/components/EventList.js";

let messageRef;

div({
	parentElement: document.body,
	class: "test-class",
	children: [
		button({
			textContent: "Refresh",
			click: getEvents,
		}),
		(messageRef = output()),
		EventList(eventsChanged),
	],
});

eventsChanged(
	() => (messageRef.value = `Got ${EventState.totalEvents} events`)
);
