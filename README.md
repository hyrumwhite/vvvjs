# Note: Documentation is still being created for this project

# VVV.js

VVVjs is Virtually Vanilla Javascript. It includes libraries that smooth out creating and querying elements, a simple router and a simple event bus. Combined together, VVVjs can be used as a framework for SPA's and MPA's.

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

## API

createElement is a proxied function. This means it can be invoked directly `createElement('div', options)` or it can be 'destructured' into functions bound to the desired prop name.

```js
import createElement from  "vvvjs";

const helloWorldBanner = createElement("marquee', {textContent: 'Hello World!'})

//is the same as

const {marquee} = createElement;
const hiWorldBanner = marquee({textContent: 'Hi world!'})
```

Because of proxy traps, the destructured prop can be any valid html tag name.

```js
const { [epic - element]: epicElement } = createElement;
const mythicElement = createElement["mythic-element"]; //also a valid way to create the element function
```

If you're familiar with HTMLElement attributes, properties, and methods, you already know the VVVjs API.

```js
const {main, section, h2 } = createElement;
main({
  parentElement: document.body,
  className: 'dark'
  children:[
    section({
      children:[
        h2({
          innerHTML: `<b>I wouldn't recommend this!</b>`,
          click($event) {
            window.alert('you clicked the welcome banner!')
          }
        })
      ]
    })
  ]
})
```

The options passed can be any valid html attribute or property. If the key is not found in the given element, i.e. 'checked' on a non-checkbox element, VVVjs assumes it should be an attribute.

### Special Keys

**parentElement**: The created element will be appended to this element

**children**: expects an array of HTMLElements and will append each element in the array to the created element

**shadowChildren**: this is not a valid html attribute/property. It is added for convenience. It expects an array of HTMLElements. A shadow DOM will be attached to the created elements, and the given elements will be appended to the shadow DOM insided the created element. Note that `style` and `link` elements are valid children.

**defineProperties**: this is not a valid html attribute/property. Using this runs Object.defineProperties on the createdElement, and passes the associated value as the second parameter. Example:

```js
const {input} = createElement;
let inputRef = input({
	value: 'some intial value',
    defineProperties; {
    	value:{
        	set() {
            }
        }
    }
})
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
