import { Events } from "/vvv/Events.js";

export const state = {
  events: [],
  totalEvents: 0,
};

const gotEventsKey = Events.createEventKey("gotEvents");

export const eventsChanged = (callback) => {
  Events.addEventListener(gotEventsKey, callback);
  return callback(state.events);
};

export const getEvents = async () => {
  const response = await fetch("/events");
  if (!response.ok) {
    throw new Error(`Could not fetch events`);
  }
  state.events = await response.json();
  state.totalEvents = state.events.length;
  Events.dispatchEvent(gotEventsKey, state.events);
  return state.events;
};
