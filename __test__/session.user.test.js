const sequelizeConnection = require("../config/connection.js");
require("dotenv").config();

// Mock request session because we are not testing Express routes
global.req = {};
global.req.session = {};
global.req.session.destroy = ((errCallback) => {
    errCallback();

    // Destroying session: User no longer logged in, no username, and no userId
    global.req.session.loggedIn = 0;
    global.req.session.user = {};

    // Production session destroy would return cookie object
    let res = {};
    res.json = myJson => myJson;
    let dbUserData = { "sid": "___", "expires": "__", "data": '{"cookie":{"originalMaxAge":"null","expires":"null", "etc":"etc.."}}' };
    res.json(dbUserData);

    return 1;
});
var app = {};
app.use = () => {};

beforeAll(async() => {
    console.log("Simulating creating session from logging in.");

    // Session boilerplate
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

    let req = {}; // Remove line when refactored into production code
    req.session = {}; // Remove line when refactored into production code
    req.session.loggedIn = 1;
    req.session.user = {
        userId: 1,
        username: "testUser"
    }

    global.req.session.loggedIn = req.session.loggedIn; // Remove line when refactored into production code
    global.req.session.user = req.session.loggedIn; // Remove line when refactored into production code
});

describe('Testing session can authorize tasks', () => {

    test('Test session can authorize tasks', () => {
        console.log("Simulate doing authorized tasks");
        expect(global.req.session.loggedIn).toBe(1);
    });

});


describe('Testing session destroyed activities', () => {

    test('Test session destroyed from logging out', () => {
        console.log("Simulate destroying session from logging out.");
        let status = global.req.session.destroy(function(err) { // Remove `const status and global` when refactored into production code
            if (err) throw err;
        });
        expect(status).toBe(1);
    });
    test('Test authorized tasks denied', () => {
        console.log('Simulate denying authorized tasks because session not active');
        expect(global.req.session.loggedIn).toBeFalsy(); // Remove `const status and global` when refactored into production code
    });

});

afterAll(async() => {
    await sequelizeConnection.close();
});