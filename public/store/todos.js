import { Events } from "/vvv/Events.js";

export const state = {
  todos: [],
};

const todoChangedKey = Events.createEventKey("todosChanged");

export const todosChanged = (callback, options) => {
  Events.addEventListener(todoChangedKey, callback, options);
  //immediately handle events
  return callback(state.todos);
};

export const saveTodos = (newTodo) => {
  const todos = state.todos;
  if (newTodo) {
    todos.push(newTodo);
  }
  try {
    const todosJSON = JSON.stringify(todos);
    localStorage.setItem("todos", todosJSON);
  } catch {
    console.error("Could not save todos");
  }

  Events.dispatchEvent(todoChangedKey, state.todos);
};
export const getTodos = () => {
  let todos = [];
  try {
    todos = JSON.parse(localStorage.todos);
  } catch (error) {
    console.error(error);
  }
  if (todos) {
    state.todos = todos;
  }
  Events.dispatchEvent(todoChangedKey, state.todos);
};
