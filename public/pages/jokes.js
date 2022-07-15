import v from "/vvv/CreateElement.js";
const { output } = v;

let button = document.getElementById("get-joke-button");
let display = output({
  parentElement: button.parentElement,
});

v(button, {
  async click() {
    console.log("clicked");
    //get joke from icanhazdadjoke.com
    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch joke");
    }
    const { joke } = await response.json();
    display.value = joke;
  },
});
