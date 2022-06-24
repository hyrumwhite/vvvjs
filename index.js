const [, , PORT = 3334] = process.argv;
const { fakeEventList } = require("./fake-event-list");
const fs = require("fs/promises");
const pureHttp = require("pure-http");
const app = pureHttp();

//servce static files in the public directory
const servePublicFiles = async (req, res) => {
  let filePath = `public${req.url}`;
  const ext = filePath.split(".").pop();
  try {
    if (filePath === "public/") {
      filePath += "index.html";
    }
    //test if filePath is directory
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      filePath += "/index.js";
    }
    //get file extension
    if (!ext) {
      filePath += ".js";
    }
    await fs.access(filePath);
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

app.get("/vvv", (req, res) => {
  res.sendFile(`public/vvv.js`, { root: __dirname });
});

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
console.log(`Server running at http://localhost:${PORT}`);
