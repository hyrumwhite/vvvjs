import { Events } from "/vvv";

const gotEventsKey = Events.createEventKey("gotEvents");
export const gotEvents = (callback) =>
	Events.addEventHandler(gotEventsKey, callback);

export const getEvents = async () => {
	const response = await fetch("/events");
	if (!response.ok) {
		throw new Error(`Could not fetch events`);
	}
	const events = await response.json();
	Events.dispatchEvent(gotEventsKey, events);
	return events;
};
