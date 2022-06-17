import { Events } from "/vvv";
const data = {
  events: [],
};

const gotEventsKey = Events.createEventKey("gotEvents");

export const eventsChanged = (callback) => {
  callback(data.events);
  Events.addEventHandler(gotEventsKey, callback);
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
