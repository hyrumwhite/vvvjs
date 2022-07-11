import v, { updateList } from "/vvv/CreateElement.js";
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
const newEventList = ({ parent, events = [], eventList }) => {
	if (eventList) {
		return update({ eventList, events });
	}
	eventList = create({ events });
	parent?.appendChild(eventList);
	return eventList;
};

/**
 * Accepts a change event function and returns an HTML Element
 * @param {function(): HTMLElement} onEventsChange
 * @returns {HTMLElement}
 */
export const EventList = (onEventsChange) => {
	let eventList = newEventList({ events: [], eventList: null });
	onEventsChange(
		(events) => {
			newEventList({ events, eventList });
		},
		{
			removeWhen: () => !eventList.isConnected,
		}
	);
	return eventList;
};
