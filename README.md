# Note: Still testing the bundling methods for this package. Will stabilize soon. Documentation is still being created for this project.

# VVV.js

VVVjs is Virtually Vanilla Javascript. It includes libraries that smooth out creating and querying elements, a simple router and a simple event bus. Combined together, VVVjs can be used as a framework for SPA's and MPA's.

**Note:** This library does not include reactivity. 

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
import createElement from "vvvjs";

const banner = createElement('marquee', {textContent: 'we are the hollow men'})

//is the same as

const {marquee} = createElement;
const secondBanner = marquee({textContent: 'the stuffed men'})

//also works
const existingMarquee = document.querySelector('marquee');
const enhancedMarquee = createElement(existingMarquee, {
  textContent: 'leaning together'
})
```

Because of proxy traps, the destructured prop can be any valid html tag name. 'fragment' is an acceptable param/key. This will return a document fragment.

The createElement function can be passed an existing element. The options passed will be applied to this element.


```js
const { ['epic-element']: epicElement } = createElement;
const mythicElement = createElement["mythic-element"]; //also a valid way to create the element function

//traps allow us to create arbitrary element functions
customElement.define('some-web-component', SomeComponentDefinition);
const { ['some-web-component']: someWebComponent } = createElement;
someWebComponent('headpiece filled with straw, alas!');

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

The options passed can be a string, an array, or an object with keys representing any valid html attribute or property with some special keys. If the key is not found in the given element, i.e. 'checked' on a non-checkbox element, VVVjs assumes it should be an attribute.

### Special Object Keys

**parentElement**: The created element will be appended to this element

**style**: Object or string. Applies the given style via `element.style = value` or `Object.assign(element.style, value)`

**children**: Expects an array of HTMLElements and will append each element in the array to the created element

**shadowChildren**: Expects an array of HTMLElements. A shadow DOM will be attached to the created elements and the given elements will be appended to the shadow DOM inside the created element. Note that `style` and `link` elements are valid children.

**function keys**: Passing a key as a function causes an event listener of type {key} to the created element. 

```js
const {input} = createElement;
input({
  parentElement: document.body,
  input($event) {
    console.log(`You entered: ${$event.target.value}`);
  }
})
```

**defineProperties**: Using this runs Object.defineProperties on the created element and passes the associated value as the second parameter. This can be used to create components that act as proxies for their children. Example:

```js
const {input, label, span} = createElement;
export const fancyInput = (props) => {
  const inputRef = input();
  const component = label({
    shadowChildren: [
      span(props.label),
      inputRef
    ],
    defineProperties: {
      value: {
        get: () => inputRef.value,
        set: value => inputRef.value = value
      }
    }
  })
  return component;
}
//we can now interact with the fancyInput label like an input, by changing fancyInput.value
```

### String option

Often an element just needs to display text. If an element function is invoked with a string, the string will be applied to the elements 'textContent' prop.

```js
const {p} = createElement;
const paragraph = p('Our dried voices, when');
//creates <p>Our dried voices, when</p>
```

### Array option

Often an element acts only as a wrapper for children. If an element function is invoked with an Array, the elements in the array will be applied as though they were passed via the 'children' key on the object options.

```js
const {div, p} = createElement;
const wrapper = div([
  p('We whisper together'),
  p('Are quiet and meaningless'),
])
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
