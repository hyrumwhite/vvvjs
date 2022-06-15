import v from "/vvv";
const { ul, li, input } = v;
export const EventList = ({ events }) =>
	ul({
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
