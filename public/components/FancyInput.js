import v from "/vvv";
const { style, span, input } = v;

export const FancyInput = (props) =>
  span({
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
      input({
        ...props,
      }),
    ],
  });
