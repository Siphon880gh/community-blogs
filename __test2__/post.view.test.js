const express = require("express");
const app = express();
const path = require("path");
const sequelizeConnection = require("../config/connection.js");

const { Model, DataTypes } = require('sequelize');

console.log(`Simulation:
- User views post. 
- All comments get listed.`);

beforeAll(async() => {
    console.log("1. Cue the models");
    const Post = require("../models/Post");
    const User = require("../models/User");
    const Comment = require("../models/Comment");

    console.log("2. Recreate the models");
    await sequelizeConnection.sync({ force: true }).then(() => {
        console.log("2a. Sequelize Resynced.");
    });

    console.log(`3. Create associations: The post being viewed has post owner, title, content, and comments`);
    console.log(`Quantitative Rule: One User associates with one or more Posts`);
    console.log(`Quantitative Rule: One Post associates with one User`);
    console.log(`Qualitative Rule: User owns Post because User's removal will NULL Post's FK`);

    User.hasMany(Post, {
        foreignKey: 'user_id'
    });

    Post.belongsTo(User, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL'
    });

    console.log(`Quantitative Rule: One User associates with one or more Comments`);
    console.log(`Quantitative Rule: One Comment associates with one User`);
    console.log(`Qualitative Rule: User owns Comment because User's removal will NULL Comment's FK`);

    User.hasMany(Comment, {
        foreignKey: 'user_id'
    });

    Comment.belongsTo(User, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL'
    });

    console.log(`Quantitative Rule: One Post associates with one or more Comments`);
    console.log(`Quantitative Rule: One Comment associates with one Post`);
    console.log(`Qualitative Rule: Post owns Comment because Post's removal will NULL Comment's FK`);

    Post.hasMany(Comment, {
        foreignKey: 'post_id'
    });

    Comment.belongsTo(Post, {
        foreignKey: 'post_id',
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

    console.log("4b. Now there are users, you can have post");
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

    console.log("4c. Now there are users, you can have comments");
    Comment.bulkCreate([{
        content: 'comment 1', // id 1
        post_id: 1,
        user_id: 2
    }]);


    console.log(`5. List specific post.
All comments listed as well.`);
    global.onePost = await Post.findOne({
        attributes: ["id", ["user_id", "userId"], "title", "content", "createdAt", "updatedAt"],
        where: {
            id: 1
        },
        include: [{
                model: User,
                attributes: ["id", "username"]
            },
            {
                model: Comment,
                attributes: [
                    ["id", "commentId"], "content", ["user_id", "userId"], "createdAt", "updatedAt"
                ],
                include: {
                    model: User,
                    attributes: [
                        ["id", "commentId"], "username"
                    ]
                }
            }
        ]
    }).then(row => {
        row = row.toJSON();

        // Flatten post username to post
        row.username = row.user.username;
        delete row.user;

        // Flatten comment username to comment
        row.comments = row.comments.map(comment => {
            comment.username = comment.user.username;
            delete comment.user;
            return comment;
        });

        return row;
    }).catch(err => {
        console.log({ err });
    });

    // console.log(global.onePost);
    // console.log(global.onePost.comments[0].username);
    console.log(JSON.stringify(global.onePost));

}); // afterAll

describe('Test findOne post', () => {

    test('Post has correct fields', () => {
        expect(global.onePost.title).toBe("title 1");
        expect(global.onePost.content).toBe("content 1");
    });

    test('Post has correctly joined username', () => {
        expect(global.onePost.username).toBe("testUser");
    });

    test('Post has 1 comment', () => {
        expect(global.onePost.comments.length).toBe(1);
    });

    test('Comment has correct fields', () => {
        expect(global.onePost.comments[0].content).toBe("comment 1");
    });

    test('Comment has correctly joined username', () => {
        expect(global.onePost.comments[0].username).toBe("testUser2");
    });
});

afterAll(async() => {
    await sequelizeConnection.close();
    console.info("\x1b[45m%s", " Test2 requires you to drop database between test suites. Test each test suite individually. Otherwise, tests will fail. Example: `npm run test2 post.view`");
});