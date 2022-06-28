import {
	getEvents,
	eventsChanged,
	state as EventState,
} from "/store/localEvents.js";

import v from "/vvv";
const { div, button, output, h1 } = v;
import { EventList } from "/components/EventList.js";
import { initializeRouter, go } from "/router.js";

let messageRef;

initializeRouter({
	outlet: document.body,
	routes: [
		{
			default: true,
			component: () =>
				div({
					children: [
						button({
							textContent: "events page",
							click() {
								go("/events-page");
							},
						}),
					],
				}),
		},
		{
			path: "/events-page",
			component: () =>
				div({
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
				}),
		},
	],
});

eventsChanged(
	() => (messageRef.value = `Got ${EventState.totalEvents} events`)
);
