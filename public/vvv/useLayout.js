/**
 *
 * @param {Function(): string} layoutFn - function that returns the layout html
 * @param {string} template - the template html
 * @returns
 */
const useLayout = (layoutFn, template) => {
  //get contents of <head> from template
  const [, head] = template.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  //get contents of body from template
  const [, body] = template.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return layoutFn({ head, body });
};
