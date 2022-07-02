import v from "/vvv";
const { fragment, div, header, main, h2, a } = v;

export const ResumePage = () =>
  fragment([
    div({ class: "left" }),
    div({ class: "content" }),
    div({ class: "right" }),
  ]);
