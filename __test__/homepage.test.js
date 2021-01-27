const express = require("express");
const app = express();
const path = require("path");
const sequelizeConnection = require("../config/connection.js");

const { Model, DataTypes } = require('sequelize');

console.log(`Simulation:
- User visits Homepage. 
- All posts get listed. 
- Each post has post owner, title, content.`);

beforeAll(async() => {
    console.log("1. Cue the models");
    const Post = require("../models/Post");
    const User = require("../models/User");

    console.log("2. Recreate the models");
    await sequelizeConnection.sync({ force: true }).then(() => {
        console.log("2a. Sequelize Resynced.");
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
        }
    ]);

    console.log(`5. List all posts.
Each post has post owner, title, content.`);
    global.posts = await Post.findAll({
        // attributes: ["id"]
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

describe('Test posts', () => {

    test('Three posts', () => {
        expect(global.posts.length).toBe(3);
    });

    test('Last post has correct fields', () => {
        const lastRow = global.posts[global.posts.length - 1];
        expect(lastRow.title).toBe("title 3");
        expect(lastRow.content).toBe("content 3");
    });

    test('Last post has correctly joined username', () => {
        const lastRow = global.posts[global.posts.length - 1];
        expect(lastRow.username).toBe("testUser3");
    });

});

afterAll(async() => {
    await sequelizeConnection.close();
})