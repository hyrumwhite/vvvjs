import v from "./CreateElement.js";
export default v;
export const createElement = v;
export { getElement } from "./GetElement.js";
export { eventBus } from "./EventBus.js";
export {
  initializeRouter,
  go,
  back,
  forward,
  replace,
  getRoutes,
  addRoutes,
} from "./Router.js";
export { RouterLink } from "./RouterLink.js";
