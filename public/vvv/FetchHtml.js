const defaultHeadNodeFilter = ["STYLE", "SCRIPT", "LINK"];

/**
 *
 * @param {string[]} filter An array of node names to pull from the fetched document
 */
export const setDefaultHeadNodeFilter = (filter) => {
  defaultHeadNodeFilter = filter;
};

/**
 *
 * @param {string} url
 * @param {RequestInit} fetchParams
 * @param {{headNodeFilter:string[], replaceTitle: boolean, bodyElementSelector:string}} fetchParams
 * @returns {}
 */

export const FetchHtml = async (
  urlWithHash,
  fetchParams = {},
  { headNodeFilter, replaceTitle = true, bodyElementSelector = null } = {}
) => {
  const [url, selector] = urlWithHash.split("#");
  if (selector && bodyElementSelector === null) {
    bodyElementSelector = `#${selector}`;
  }
  headNodeFilter = headNodeFilter || defaultHeadNodeFilter;
  let response = await fetch(url, fetchParams);
  if (response.ok) {
    let template = await response.text();
    let domParser = new DOMParser();
    template = domParser.parseFromString(template, "text/html");
    let head =
      template.querySelector("head") || document.createDocumentFragment();
    let body =
      template.querySelector("body") || document.createDocumentFragment();
    if (bodyElementSelector) {
      body = body.querySelector(bodyElementSelector);
    }

    for (let element of head.children) {
      if (element.nodeName === "TITLE" && replaceTitle) {
        document.title = element.textContent;
      } else if (
        headNodeFilter == null ||
        headNodeFilter.includes(element.nodeName)
      ) {
          let src = element.getAttribute("src");
          let href = element.getAttribute("src");
          if (document.head.querySelector(`[src="${src}"]`) == null) {
            let script = document.createElement("script");
            for (let attribute of element.attributes) {
              script.setAttribute(attribute.name, attribute.value);
            }
            document.head.appendChild(script);
          }
        } else {
          let href = element.getAttribute("href");
          if (document.head.querySelector(`[href="${href}"]`) == null) {
            document.head.appendChild(element);
          }
        }
      }
    }
    return body;
  }
};
