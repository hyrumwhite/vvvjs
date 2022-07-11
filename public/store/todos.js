import { Events } from "/vvv/Events.js";

export const state = {
	tasks: [],
};

const todoChangedKey = Events.createEventKey("todosChanged");

export const todosChanged = (callback) => {
	Events.addEventHandler(taskChangedKey, callback);
	//immediately handle events
	return callback(state.todos);
};

export const saveATodo = { text: "", done };
export const getTodos = () => {
	let todos = [];
	try {
		todos = JSON.stringify(localStorage.savedTodos);
	} catch (error) {
		console.error(error);
	}
	if (todos) {
		state.todos = todos;
	}
	events.dispatchEvent(todoChangedKey, state.todos);
};
