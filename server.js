// Initiate Express, Sequelize, etc
const express = require("express");
const app = express();
const path = require("path");
const sequelizeConnection = require("./config/connection.js");
require("dotenv").config();

// Initiate Express-Handlebars
const exhbs = require("express-handlebars");
const hbs = exhbs.create();
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Initiate Session
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: process?.env?.SESSION_SECRET || "",
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelizeConnection
    })
};

app.use(session(sess));

// Get routes
app.use(require('./controllers/'));

// Request ready
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CSS and js files
app.use(express.static("./public"));

// Setup 404 page
app.use((req, res, next) => {
    res.status("404").send("We hit a 404 wall").end();
});

// Listen for requests
sequelizeConnection.sync({ force: true }).then(() => {
    let port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server listening at ${port}`);
    });
});