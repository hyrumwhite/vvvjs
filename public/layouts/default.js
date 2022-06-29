import v from "/vvv";
const { div, header, main, h2 } = v;

export const DefaultLayout = (props = {}) =>
	div({
		style: {
			display: "flex",
			flexDirection: "column",
			height: "100%",
		},
		children: [
			header({
				style: {
					display: "flex",
					flex: "0 0 auto",
					height: "56px",
					background: "wheat",
					alignItems: "center",
					padding: "0px 1rem",
				},
				children: [h2("sethwhite.dev")],
			}),
			main({
				id: "main-outlet",
				style: {
					display: "flex",
					flex: "1 1 auto",
					overflow: "auto",
				},
				children: props.body || [],
			}),
		],
	});
