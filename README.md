# Note: This project is very much a Work in Progress

# VVV.js

VVVjs is Virtually Vanilla Javascript. It includes libraries that smooth out creating and querying elements, a light router and a simple event bus. Combined together, VVVjs can be used as a framework for SPA's and MPA's.

# createElement

```js
import createElement from "vvvjs";
const { fragment, header, h2, a, main } = createElement;

const HomePageLink = () =>
  h2([
    a({
      textContent: "sethwhite.dev",
      href: "/",
      click($event) {
        console.log("heading home!");
      },
    }),
  ]);

fragment({
  parentElement: document.body,
  children: [
    header({
      class: "hero",
      children: [HomePageLink()],
    }),
    main({
      id: "main-outlet",
      style: {
        display: "flex",
        flex: "1 1 auto",
        overflow: "auto",
      },
    }),
  ],
});
```

# getElement

```js
import { getElement } from "vvvjs";

const main = getElement("#main-outlet");

main.$div.style.backgroundColor = "red";

main.$$input.forEach((input) => (input.style.backgroundColor = "blue"));

main["$#footer > select"].$option[0].setAttribute("selected", true);
```

# Router

# Event Bus
