/**
 * Insert some sample posts, comments, and users for testing purposes.
 */

const sequelizeConnection = require('../config/connection');
const { Comment, Post, User, Session } = require("../models");

const seedAll = async() => {
    // Reset database
    await sequelizeConnection.sync({ force: true });

    console.log("Create sample data for testing purposes");
    console.log("a. Must have users before there are posts");
    await User.bulkCreate([{
            username: 'test', // id 1
            email: 'test@test.com',
            password: 'test'
        },
        {
            username: 'test2', // id 2
            password: 'test2',
            email: 'test2@test.com'
        },
        {
            username: 'test3', // id 3
            password: 'test3',
            email: 'test3@test.com'
        }
    ], { individualHooks: true });

    console.log("b. Now there are users, you can have post");
    await Post.bulkCreate([{
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
    console.log("c. Now there are users, you can have comments");
    await Comment.bulkCreate([{
        content: 'comment 1', // id 1
        post_id: 1,
        user_id: 2
    }]);


    process.exit(0);
};

seedAll();