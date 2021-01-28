const { Model, DataTypes } = require('sequelize');
const sequelizeConnection = require("../config/connection.js");

// Test Express Route
const request = require('supertest');
var express = require("express");
var app = express();
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');

// Models
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

console.log(`Simulation:
- User adds comment to a post.`);

beforeAll(async() => {
    console.log("1. Cue the models");

    console.log("2. Recreate the models");
    await sequelizeConnection.sync({ force: true }).then(() => {
        console.log("2a. Sequelize Resynced.");
    });

    console.log("3. Seed the simulation");
    console.log("3a. Seed the users");
    User.bulkCreate([{
            username: 'testUser', // id 1
            email: 'testUser@domain.com',
            password: 'testUser'
        },
        {
            username: 'testUser2', // id 1
            email: 'testUser2@domain.com',
            password: 'testUser2'
        }
    ]);
    console.log("3b. Seed the post");
    Post.bulkCreate([{
        title: 'title 1pc', // id 1
        content: 'content 1pc',
        user_id: 1
    }]);

    console.log("4. Prepare express route POST /comments");
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.post("/posts/:postId/comments", async(req, res) => {
        const { postId } = req.params;
        const { content } = req.body;

        // Mock session
        req.session = {}; // Remove line when refactored into production code
        req.session.user = {}; // Remove line when refactored into production code
        const userId = req.session.user.id = 2;

        const success = await Comment.create({
            content,
            user_id: userId,
            post_id: postId
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

describe('Testing adding a comment to a post by requesting POST /posts/1/comments', () => {

    test('Test adding a comment to a post by requesting POST /posts/1/comments', async() => {
        const response = await request(app).post('/posts/1/comments').send({ content: "title 1c" });
        expect(JSON.parse(response.text).success).toBe(1);
    });

});


afterAll(async() => {
    await sequelizeConnection.close();
    console.info("\x1b[45m%s", " Test2 requires you to drop database between test suites. Test each test suite individually. Example: `npm run test2 post.view`");
});