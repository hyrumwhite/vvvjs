import { events } from "/vvv";

export const state = {
	events: [],
	totalEvents: 0,
};

const gotEventsKey = events.createEventKey("gotEvents");

export const eventsChanged = (callback) => {
	events.addEventHandler(gotEventsKey, callback);
	return callback(state.events);
};

export const getEvents = async () => {
	const response = await fetch("/events");
	if (!response.ok) {
		throw new Error(`Could not fetch events`);
	}
	state.events = await response.json();
	state.totalEvents = state.events.length;
	events.dispatchEvent(gotEventsKey, state.events);
	return state.events;
};
