const express = require("express");
const app = express();
const path = require("path");
const sequelizeConnection = require("../config/connection.js");

const { Model, DataTypes } = require('sequelize');

console.log(`Simulation:
- User visits Dashboard. 
- All posts by that user gets listed. 
- Each post has post owner, title, content.`);

beforeAll(async() => {
    console.log("1. Cue the models");
    const Post = require("../models/Post");
    const User = require("../models/User");

    console.log("2. Recreate the models");
    await sequelizeConnection.sync({ force: true }).then(() => {
        console.log("2a. Sequelize Resynced.");

        console.log("2b. Mock logged in user");
        global.user = {
            userId: 1,
            username: "testUser"
        }
        global.loggedIn = 1;
        console.log({ loggedIn: global.loggedIn, user: global.user });
    });

    console.log(`3. Create associations: Each post has post owner, title, content`);
    console.log(`Quantitative Rule: One User associates with one or more Posts`);
    console.log(`Quantitative Rule: One Post associates with one User`);
    console.log(`Qualitative Rule: User owns Post because User's removal will set Post's FK to NULL`);

    User.hasMany(Post, {
        foreignKey: 'user_id'
    });

    Post.belongsTo(User, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL'
    });


    console.log("4. Seed the simulation");
    console.log("4a. Must have users before there are posts");
    User.bulkCreate([{
            username: 'testUser', // id 1
            email: 'testUser@domain.com',
            password: 'testUser'
        },
        {
            username: 'testUser2', // id 2
            password: 'testUser2',
            email: 'testUser2@domain.com'
        },
        {
            username: 'testUser3', // id 3
            password: 'testUser3',
            email: 'testUser3@domain.com'
        }
    ]);
    console.log("4b. Now there are users, you can have posts");
    Post.bulkCreate([{
            title: 'title 1', // id 1
            content: 'content 1',
            user_id: 1
        },
        {
            title: 'title 2', // id 2
            content: 'content 2',
            user_id: 2
        },
        {
            title: 'title 3', // id 3
            content: 'content 3',
            user_id: 3
        }, {
            title: 'title 1b', // id 1
            content: 'content 1b',
            user_id: 1
        },
    ]);

    console.log(`5. List posts by logged in user.
Each post has post owner, title, content.`);
    global.posts = await Post.findAll({
        // attributes: ["id"]
        where: {
            user_id: global.user.userId
        },
        include: {
            model: User
        }
    }).then(rows => {
        rows = rows.map(row => {
            // Flatten the row to result in a new field username
            let myRow = row.dataValues;
            delete myRow.user;
            myRow.username = row.user.dataValues.username;
            return myRow;
        });

        // console.log(rows);
        return rows;
    }).catch(err => {
        console.log({ err });
    });

}); // beforeAll

describe('Test posts by loggged in user', () => {

    test('User is authorized', () => {
        // If false on runtime: Send a 401 Unauthorized response and redirect to login route
        expect(global.loggedIn).toBe(1);
    });

    test('Two posts', () => {
        expect(global.posts.length).toBe(2);
    });

    test('Each post has correct fields', () => {
        expect(global.posts[0].title).toBe("title 1");
        expect(global.posts[0].content).toBe("content 1");
        expect(global.posts[1].title).toBe("title 1b");
        expect(global.posts[1].content).toBe("content 1b");
    });

    test('All posts are owned by user', () => {
        expect(global.posts[0].username).toBe("testUser");
        expect(global.posts[1].username).toBe("testUser");
    });

});

afterAll(async() => {
    await sequelizeConnection.close();
    console.info("\x1b[45m%s", " Test2 requires you to drop database between test suites. Test each test suite individually. Example: `npm run test2 post.view`");
});