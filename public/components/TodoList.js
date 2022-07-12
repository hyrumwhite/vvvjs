import v, { updateList } from "/vvv/CreateElement.js";
const { div, ul, input, label, button } = v;
import $ from "/vvv/GetElement.js";

import { saveTodos, todosChanged, state } from "/store/todos.js";

export const TodoList = () => {
  const Todo = (todo, index) => {
    const TodoInput = input({
      type: "checkbox",
      dataTodo: todo,
      dataIndex: index,
      checked: todo.done,
      change($event) {
        $event.target.dataTodo.done = $event.target.checked;
        saveTodos();
      },
    });

    const RemoveButton = button({
      textContent: "Remove",
      click($event) {
        let index = $event.target.dataIndex;
        state.todos.splice(index, 1);
        saveTodos();
      },
    });

    return div({
      class: "row align-center",
      children: [
        label({
          class: "row align-center",
          children: [TodoInput, todo.text],
        }),
        RemoveButton,
      ],
    });
  };

  const list = ul([...state.todos.map(Todo)]);

  todosChanged(() =>
    updateList(list, state.todos, {
      createChild: Todo,
      updateChild(li, todo, index) {
        let $li = $(li);
        $li.$input.checked = todo.done;
        $li.$input.dataTodo = todo;
        $li.$button.dataIndex = index;
        $li.$label.childNodes[1].nodeValue = todo.text;
      },
    })
  );

  return list;
};
