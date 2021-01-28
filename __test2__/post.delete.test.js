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
- User deletes post.`);

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
    console.log("2b. Seed the post");
    Post.bulkCreate([{
        title: 'title 1pd', // id 1
        content: 'content 1pd',
        user_id: 1
    }]);

    console.log("3. Prepare express route DELETE /posts/:postId");
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.delete("/posts/:postId", async(req, res) => {
        const { postId } = req.params;
        const { title, content } = req.body;

        // Mock session
        req.session = {}; // Remove line when refactored into production code
        req.session.user = {}; // Remove line when refactored into production code
        const userId = req.session.user.id = 1;

        // This request can fail for reasons of unauthorized deleting or database error
        let fail = false;

        // Can the current user delete this post?
        const isAllowedDelete = await Post.findOne({
            where: {
                user_id: userId,
                id: postId
            }
        }).then(row => {
            if (row) row = row.get({ plain: true });
            return row;
        });
        if (isAllowedDelete) {
            // Then delete the post
            const success = await Post.destroy({
                where: {
                    user_id: userId,
                    id: postId
                }
            });
            if (!success)
                fail = true;
        } else {
            fail = true;
        }

        // If user has no permission or post deletion fails
        if (fail)
            res.status(403).json({ success: 0 });
        else
            res.json({ success: 1 });

    }); // put

}); // beforeAll

describe('Testing a post still exists', () => {

    app.get("/posts/:postId", async(req, res) => {
        const { postId } = req.params;

        // Can the current user delete this post?
        const dbPostData = await Post.findOne({
            where: {
                id: postId
            }
        }).then(row => {
            if (row) row = row.toJSON();
            return row;
        });
        if (dbPostData) {
            res.json(dbPostData);
        } else {
            res.json({});
        }
    }); // get posts/:postId

    test('Test a post still exists', async() => {
        const response = await request(app).get('/posts/1');
        // console.log({ response })
        expect(JSON.parse(response.text)).toHaveProperty('title', 'title 1pd');
    });

});


describe('Testing deleting that post', () => {

    test('Test deleting that post', async() => {
        const response = await request(app).delete('/posts/1').send({});
        // console.log({ response })
        expect(JSON.parse(response.text).success).toBe(1);
    });

});


afterAll(async() => {
    await sequelizeConnection.close();
    console.info("\x1b[45m%s", " Test2 requires you to drop database between test suites. Test each test suite individually. Example: `npm run test2 post.view`");
});