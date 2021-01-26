const express = require("express");
const app = express();
const path = require("path");

// Initiate Express-Handlebars
const exhbs = require("express-handlebars");
const hbs = exhbs.create();
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Request ready
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CSS and js files
app.use(express.static("./public"));

app.get("/", (req, res) => {
    let data1 = req.body;
    res.json({ text: "Test successful" });
});

// Setup 404 page
app.use((req, res, next) => {
    res.status("404").send("We hit a 404 wall").end();
});

// Listen for requests
let port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});