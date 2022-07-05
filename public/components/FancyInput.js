import v from "/vvv.js";
const { style, span, input } = v;

export const FancyInput = (props) => {
	let inputRef = input({ ...props });
	let element = span({
		shadowChildren: [
			style`
				input {
					border: 1px solid black;
					border-radius: 4px;
					padding: .25rem;
				}
			`,
			inputRef,
		],
		defineProperties: {
			value: {
				get: () => inputRef.value,
				set: (value) => (inputRef.value = value),
			},
		},
	});
	return element;
};
