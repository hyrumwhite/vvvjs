import v from "/vvv/CreateElement.js";
const { img } = v;

let button = document.getElementById("get-cats-button");
let display = img({
  style: { width: "300px" },
  parentElement: button.parentElement,
});

v(button, {
  async click() {
    console.log("clicked");
    //get cat pic from cat pic api
    const response = await fetch("https://api.thecatapi.com/v1/images/search", {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch joke");
    }
    const [{ url }] = await response.json();
    console.log(url);
    display.src = url;
  },
});
