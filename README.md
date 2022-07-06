# VVV.js

VVV.js is Virtually Vanilla Javascript. Its a collection of libraries to smooth out creating and querying elements. It's intended to be used as a zero build time tool to build simple and complex web pages and apps, but it is compatible with build tools.

```js
import v from "./path/to/vvvjs/createElement.js";
const { fragment, header, h2, a, main } = v;

fragment({
  parentElement: document.body,
  children: [
    header({
      class: "hero",
      children: [
        h2([
          a({
            textContent: "sethwhite.dev",
            href: "/",
          }),
        ]),
      ],
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
