const [, , PORT = 3334] = process.argv;
const express = require("express");
const app = express();
app.use(express.static("public"));

app.get("/vvv", (req, res) => {
	//set content type header to javascript
	res.setHeader("Content-Type", "application/javascript");
	res.sendFile(`public/vvv.js`, { root: __dirname });
});
app.get("/components/:name", (req, res) => {
	//set content type header to javascript
	res.setHeader("Content-Type", "application/javascript");
	if (req.params.name.endsWith(".js")) {
		res.sendFile(`public/components/${req.params.name}`, { root: __dirname });
	} else {
		res.sendFile(`public/components/${req.params.name}.js`, {
			root: __dirname,
		});
	}
});
app.get("/store/:name", (req, res) => {
	//set content type header to javascript
	res.setHeader("Content-Type", "application/javascript");
	if (req.params.name.endsWith(".js")) {
		res.sendFile(`public/store/${req.params.name}`, { root: __dirname });
	} else {
		res.sendFile(`public/store/${req.params.name}.js`, {
			root: __dirname,
		});
	}
});
app.get("/public/:name", (req, res) => {
	//set content type header to javascript
	res.setHeader("Content-Type", "application/javascript");
	if (req.params.name.endsWith(".js")) {
		res.sendFile(`public/${req.params.name}`, { root: __dirname });
	} else {
		res.sendFile(`public/${req.params.name}.js`, {
			root: __dirname,
		});
	}
});

app.get("/events", (req, res) => {
	let data = [
		{
			name: "Movies in the park",
			date: Date.now(),
			id: 1,
			description: "its going to be fun",
		},
		{
			name: "Mozart Concert",
			date: Date.now(),
			id: 2,
			description: "its going to be fun",
		},
		{
			name: "Rave",
			date: Date.now(),
			id: 3,
			description: "its going to be fun",
		},
		{
			name: "Masonic Lodge Open House",
			date: Date.now(),
			id: 4,
			description: "its going to be fun",
		},
		{
			name: "Chocolate Tasting",
			date: Date.now(),
			id: 5,
			description: "its going to be fun",
		},
		{
			name: "Fishing",
			date: Date.now(),
			id: 6,
			description: "its going to be fun",
		},
		{
			name: "Electric Eel Petting Zoo",
			date: Date.now(),
			id: 7,
			description: "its going to be fun",
		},
		{
			name: "Banana Picking",
			date: Date.now(),
			id: 8,
			description: "its going to be fun",
		},
		{
			name: "Pie Eating Contest",
			date: Date.now(),
			id: 9,
			description: "its going to be fun",
		},
		{
			name: "Yoga",
			date: Date.now(),
			id: 10,
			description: "its going to be fun",
		},
	];
	//randomly shuffle the events
	data = data.sort(() => Math.random() - 0.5);
	//send a random amount of events
	let amount = Math.floor(Math.random() * data.length) || 1;
	res.send(data.slice(0, amount));
});

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
