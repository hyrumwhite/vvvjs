import v from "/vvv/CreateElement.js";
const { style, div, input } = v;
import { FancyInput } from "/components/FancyInput.js";

let firstInput = null;
let secondInput = null;

export const ShadowPage = () =>
  div({
    children: [
      (firstInput = FancyInput({
        placeholder: "Input goes here",
        value: "Im a value",
        input() {
          secondInput.value = firstInput.value;
        },
      })),
      (secondInput = FancyInput({
        placeholder: "Input goes here",
        value: "Im a value",
        input() {},
      })),
    ],
  });
