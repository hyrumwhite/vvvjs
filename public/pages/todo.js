import v from "/vvv.js";
const { div, span, input } = v;
import {
	addTask,
	getTasks,
	saveTasks,
	tasksChanged,
	state,
} from "/store/tasks.js";

export const TodoPage = () => {
	getTasks();

	const MainInput = input({
		keydown($event) {
			if ($event.key === "Enter") {
				addTask(mainInput.value);
				mainInput.value = "";
			}
		},
	});

	const TaskCount = span();

	tasksChanged(
		() => (TaskCount.textContent = `Total tasks: ${state.tasks.length}`)
	);

	return div({
		class: "grow column",
		style: { alignSelf: "center", width: "min(800px, 100%)" },
		children: [
			div({
				class: "row align-center",
				children: [
					label({ textContent: "Enter a todo:", children: [MainInput] }),
					TaskCount,
				],
			}),
		],
	});
};
