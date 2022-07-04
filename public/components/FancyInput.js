import v from "/vvv";
const { style, span, input } = v;

export const FancyInput = (props) => {
  let inputRef = null;
  let element = span({
    shadowChildren: [
      style({
        textContent: `
				input {
					border: 1px solid black;
					border-radius: 4px;
					padding: .25rem;
				}
			`,
      }),
      (inputRef = input({
        ...props,
      })),
    ],
  });
  Object.defineProperty(element, "value", {
    get() {
      return inputRef.value;
    },
    set(value) {
      inputRef.value = value;
    },
  });
  return element;
};
