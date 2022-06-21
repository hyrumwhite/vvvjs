import { Events } from "/vvv";
const data = {
  events: [],
};

const gotEventsKey = Events.createEventKey("gotEvents");

export const eventsChanged = (callback) => {
  Events.addEventHandler(gotEventsKey, callback);
  return callback(data.events);
};

export const getEvents = async () => {
  const response = await fetch("/events");
  if (!response.ok) {
    throw new Error(`Could not fetch events`);
  }
  const events = await response.json();
  data.events = events;
  Events.dispatchEvent(gotEventsKey, data.events);
  return events;
};
