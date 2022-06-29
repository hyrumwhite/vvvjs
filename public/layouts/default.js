import v from "/vvv";
const { div, header, section } = v;

export const DefaultLayout = (props) =>
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
        },
      }),
      section({
        style: {
          display: "flex",
          flex: "1 1 auto",
          overflow: "auto",
        },
        children: props.body,
      }),
    ],
  });
