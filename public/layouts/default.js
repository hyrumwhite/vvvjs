import v from "/vvv";
const { fragment, div, header, main, h2, a } = v;

const Links = () =>
  div({
    class: "row gap-3",
    children: [
      a({
        textContent: "Github",
        href: "https://github.com/hyrumwhite",
      }),
      a({
        textContent: "Twitter",
        href: "https://twitter.com/fluffydev",
      }),
      a({
        textContent: "LinkedIn",
        href: "https://www.linkedin.com/in/hyrumswhite/",
      }),
    ],
  });

export const DefaultLayout = (props = {}) =>
  fragment([
    header({
      class: "hero",
      children: [
        h2([
          a({
            textContent: "sethwhite.dev",
            href: "/",
          }),
        ]),
        Links(),
      ],
    }),
    main({
      id: "main-outlet",
      style: {
        display: "flex",
        flex: "1 1 auto",
        overflow: "auto",
      },
      children: props.body || [],
    }),
  ]);
