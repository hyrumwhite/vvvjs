import v from "/vvv";
const { style, div, input } = v;
// import {FancyInput} from "/components/FancyInput.js";

let firstInput = null;
let secondInput = null;

export const ShadowPage = () =>
  div({
    shadowChildren: [
      (firstInput = input({
        placeholder: "Input goes here",
        value: "Im a value",
        input() {
          secondInput.value = firstInput.value;
        },
      })),
      (secondInput = input({
        placeholder: "Input goes here",
        value: "Im a value",
        input() {},
      })),
    ],
  });
