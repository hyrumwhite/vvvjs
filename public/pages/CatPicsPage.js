import { FetchHtml } from "../vvv/FetchHtml.js";

export const CatPicsPage = async () => {
  return FetchHtml("/cats.html#main-outlet");
};
