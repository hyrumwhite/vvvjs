import { fakeEventList } from "./fake-event-list.js";
import fs from "fs/promises";
import pureHttp from "pure-http";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import { createPages } from "./public/vvv/createPages.js";
import { DefaultLayout } from "./islands/layouts/default.js";
createPages("./islands/pages", "./public", DefaultLayout);

const app = pureHttp();

const [, , PORT = 3334] = process.argv;

//servce static files in the public directory
const servePublicFiles = async (req, res) => {
  let filePath = `public${req.url}`;
  let fileParts = filePath.split(".");
  let ext = null;
  if (fileParts.length > 1) {
    ext = fileParts[fileParts.length - 1];
  }
  try {
    if (filePath === "public/") {
      filePath += "index.html";
    }
    //test if filePath is directory
    try {
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        filePath += "/index.js";
      }
    } catch (e) {
      //filePath is not a directory
    }
    //get file extension
    if (!ext) {
      filePath += ".js";
    }
    await fs.stat(filePath);
    res.sendFile(filePath, { root: __dirname });
  } catch (err) {
    //file doesn't exist
    if (ext) {
      res.status(404).send("File not found");
    } else {
      res.sendFile("public/index.html", { root: __dirname });
    }
  }
};

app.get("/events", (req, res) => {
  let data = fakeEventList;
  //randomly shuffle the events
  data = data.sort(() => Math.random() - 0.5);
  //send a random amount of events
  let amount = Math.floor(Math.random() * data.length) || 1;
  res.send(data.slice(0, amount));
});

app.get("*", servePublicFiles);

app.listen(PORT);
//log link to server
console.info(`Server running at http://localhost:${PORT}`);
