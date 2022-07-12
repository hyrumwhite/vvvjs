import v from "/vvv/CreateElement.js";
const { div, span, input, label } = v;
import { getTodos, saveTodos, todosChanged, state } from "/store/todos.js";
import { TodoList } from "/components/TodoList";
export const TodoPage = () => {
  getTodos();

  const MainInput = input({
    keydown($event) {
      if ($event.key === "Enter") {
        saveTodos({ text: MainInput.value, done: false });
        MainInput.value = "";
      }
    },
  });

  const TodosCount = span();
  todosChanged(
    () => (TodosCount.textContent = `Total todos: ${state.todos.length}`),
    { removeWhen: () => !TodosCount.isConnected }
  );

  return div({
    class: "grow column align-center",
    style: { alignSelf: "center", width: "min(800px, 100%)" },
    children: [
      div({
        class: "row align-center",
        children: [
          label({ textContent: "Enter a todo:", children: [MainInput] }),
          TodosCount,
        ],
      }),
      TodoList(),
    ],
  });
};
