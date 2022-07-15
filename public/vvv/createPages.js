import fs from "fs/promises";
import { useLayout } from "./useLayout.js";

export const createPages = async (pagesDir, destinationDir, layoutFn) => {
  const pages = await fs.readdir(pagesDir);
  return Promise.all(
    pages.map(async (page) => {
      if (page.endsWith(".html")) {
        const pagePath = `${pagesDir}/${page}`;
        const pageData = await fs.readFile(pagePath, "utf8");
        const layout = useLayout(layoutFn, pageData);
        return fs.writeFile(`${destinationDir}/${page}`, layout);
      }
    })
  );
};
