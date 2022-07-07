import { events } from "/vvv.js";

export const state = {
	tasks: [],
};

const taskChangedKey = events.createEventKey("tasksChanged");

export const tasksChanged = (callback) => {
	events.addEventHandler(taskChangedKey, callback);
	//immediately handle events
	return callback(state.tasks);
};

export const getTasks = () => {
	let tasks = [];
	try {
		tasks = JSON.stringify(localStorage.savedTasks);
	} catch (error) {
		console.error(error);
	}
	if (tasks) {
		state.tasks = tasks;
	}
	events.dispatchEvent(taskChangedKey, state.tasks);
};
