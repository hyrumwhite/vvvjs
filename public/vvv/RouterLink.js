import CreateElement from "./CreateElement.js";
import { go, insertParamsIntoPath, getRoutes } from "./Router.js";

/**
 *
 * @param {{name: string, to: string, params}}} props
 * @returns
 */
export const RouterLink = (props) => {
  if (props.name) {
    let routes = getRoutes();
    console.log(routes);
    props.to = routes.find((route) => route.name === props.name).path;
  }
  return CreateElement("a", {
    ...props,
    href: insertParamsIntoPath(props.to, props.params),
    click($event) {
      $event.preventDefault();
      props.click?.($event);
      go(props.to, props.params);
    },
  });
};
