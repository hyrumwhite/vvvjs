import v from "/vvv/CreateElement.js";
const { div, h1, button, output } = v;

import {
	getEvents,
	eventsChanged,
	state as EventState,
} from "/store/localEvents.js";

import { EventList } from "/components/EventList.js";

export const EventsPage = () => {
	let messageRef = null;
	let element = div({
		class: "test-class",
		children: [
			h1("Upcoming Events"),
			button({
				textContent: "Refresh",
				click: getEvents,
			}),
			(messageRef = output()),
			EventList(eventsChanged),
		],
	});
	eventsChanged(
		() => (messageRef.value = `Got ${EventState.totalEvents} events`),
		{
			removeWhen: () => !messageRef.isConnected,
		}
	);
	return element;
};
