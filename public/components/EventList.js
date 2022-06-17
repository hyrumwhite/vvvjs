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
  parent.appendChild(list);
  return list;
};

const update = ({ eventList, events }) => {
  eventList.innerHTML = "";
  create({ parent: eventList, events });
};

/**
 * @param {{parent: HTMLElement, events: Array<{name: string, description:string}>}} param0
 */
export const EventList = ({ parent, events, eventList }) => {
  if (eventList) {
    console.log(eventList, events);
    return update({ eventList, events });
  }
  return create({ parent, events });
};
