import v, { updateList } from "/vvv";
const { ul, li, input } = v;

const listItem = (event) =>
	li({
		children: [
			input({
				type: "checkbox",
			}),
			event.name,
		],
	});

const create = ({ events }) => {
	let list = ul({
		children: events.map(listItem),
	});
	list.data_events = window.structuredClone(events);
	return list;
};

const update = ({ eventList, events }) => {
	return updateList(eventList, events, {
		createChild(event) {
			return listItem(event);
		},
		updateChild(child, event) {
			child.childNodes[1].nodeValue = event.name;
		},
	});
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
