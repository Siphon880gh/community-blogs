const express = require("express");
const app = express();
const path = require("path");
const sequelizeConnection = require("../config/connection.js");

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const { exec } = require("child_process");

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
        global.userSession = {
            userId: 1,
            username: "testUser"
        }
        global.loggedIn = 1;
        console.log({ loggedIn: global.loggedIn, userSession: global.userSession });
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
            user_id: global.userSession.userId
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

afterAll(async() => {
    await sequelizeConnection.close();
})