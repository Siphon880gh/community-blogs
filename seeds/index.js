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
            username: 'weng', // id 2
            password: 'weng',
            email: 'weng@wengindustries.com'
        }
    ], { individualHooks: true });

    console.log("b. Now there are users, you can have post");
    await Post.bulkCreate([{
            title: 'Welcome', // id 1
            content: 'This is a tech blog by Weng. Here we will post tutorials on different programming subjects. You can also join in on the fun by creating an account and contributing posts!',
            user_id: 2
        },
        {
            title: 'Moved to Devbrain', // id 2
            content: 'It is Weng. I have decided this may not be the best platform for sharing programming notes. I deleted all previous tutorials and moved them here at <a href="https://codingnotes.dev" target="_blank">CodingNotes.Dev</a>. There is a link to the Github repository so you can make pull requests and I will accept programming tutorial contributions. Thank you - Weng.',
            user_id: 2
        }
    ]);
    console.log("c. Now there are users, you can have comments");
    await Comment.bulkCreate([{
        content: 'And the web app there has more interactive elements that make reading notes easier!', // id 1
        post_id: 2,
        user_id: 1
    }]);


    process.exit(0);
};

seedAll();