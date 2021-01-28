const { Model, DataTypes } = require('sequelize');
const sequelizeConnection = require("../config/connection.js");

// Test Express Route
const request = require('supertest');
var express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
var app = express();
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');

console.log(`Simulation:
- User posts.`);

beforeAll(async() => {
    console.log("1. Cue the models");

    console.log("2. Recreate the models");
    await sequelizeConnection.sync({ force: true }).then(() => {
        console.log("2a. Sequelize Resynced.");
    });

    console.log("2. Seed the simulation");
    console.log("2a. Seed the user");
    User.bulkCreate([{
        username: 'testUser', // id 1
        email: 'testUser@domain.com',
        password: 'testUser'
    }]);

    console.log("3. Prepare express route POST /posts");
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.post("/posts", async(req, res) => {
        const { title, content } = req.body;

        // Mock session
        req.session = {}; // Remove line when refactored into production code
        req.session.user = {}; // Remove line when refactored into production code
        const userId = req.session.user.id = 1;

        const success = await Post.create({
            title,
            content
        }, {
            where: {
                user_id: userId
            }
        });
        if (success) {
            // res.redirect("/homepage");
            // console.log({ success })
            res.json({ success: 1 });
        } else {
            res.json({ success: 0 });
        }

    });

}); // beforeAll

describe('Testing making a post', () => {

    test('Test making a post', async() => {
        const response = await request(app).post('/posts').send({ title: "title 1p", content: "content 1p" });
        expect(JSON.parse(response.text).success).toBe(1);
    });

});


afterAll(async() => {
    await sequelizeConnection.close();
    console.info("\x1b[45m%s", " Test2 requires you to drop database between test suites. Test each test suite individually. Otherwise, tests will fail. Example: `npm run test2 post.view`");
});