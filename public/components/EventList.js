import v from "/vvv";
const { ul, li, input } = v;

const create = ({ parent, events }) => {
  let list = ul({
    children: events.map((event) =>
      li({
        children: [
          input({
            type: "checkbox",
          }),
          event.name,
        ],
      })
    ),
  });
  list.data_events = window.structuredClone(events);
  return list;
};

const update = ({ eventList, events }) => {
  console.time();
  for (let event of events) {
  }
  eventList.parentElement.insertBefore(newEventList, eventList);
  eventList.remove();
  console.timeEnd();
  return newEventList;
};

/**
 * @param {{parent: HTMLElement, events: Array<{name: string, description:string}>}} param0
 */
export const EventList = ({ parent, events, eventList }) => {
  if (eventList) {
    return update({ eventList, events });
  }
  eventList = create({ events });
  parent.appendChild(eventList);
  return eventList;
};
