# Note: This project is very much a Work in Progress

# VVV.js

VVV.js is Virtually Vanilla Javascript. Its a collection of libraries to smooth out creating and querying elements. It's intended to be used as a zero build time tool to build simple and complex web pages and apps, but it is compatible with build tools.

```js
import v from "./path/to/vvvjs/createElement.js";
const { fragment, header, h2, a, main } = v;

const HomePageLink = () => 
  h2([
    a({
      textContent: "sethwhite.dev",
      href: "/",
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
