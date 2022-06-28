import { getEvents, eventsChanged } from "/store/localEvents.js";
import v from "/vvv";
const { div, button, output } = v;
import { EventList } from "/components/EventList.js";

let message;

div({
	parentElement: document.body,
	class: "test-class",
	children: [
		button({
			textContent: "Refresh",
			click: getEvents,
		}),
		(message = output()),
		EventList(eventsChanged),
	],
});

eventsChanged((events) => (message.value = `Got ${events.length} events`));
