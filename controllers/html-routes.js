const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// Set your website's name
global.CONSTANT_SITE_TITLE = "The Tech Blog";

// Workaround when you're at /post/:postId, and clicking another link like /dashboard goes to /post/dashboard
// Then it will redirect one level up to get rid of /post so you can arrive to /dashboard
router.get('/posts/posts', (req, res) => {
    res.redirect("/app/community-blogs/posts");
    return;
});
router.get('/posts/login', (req, res) => {
    res.redirect("/app/community-blogs/login");
    return;
});
router.get('/posts/signup', (req, res) => {
    res.redirect("/app/community-blogs/signup");
    return;
});
router.get('/posts/dashboard', (req, res) => {
    res.redirect("/app/community-blogs/dashboard");
    return;
});

// The actual html routes
router.get('/', async(req, res) => {
    // Whether or not logged in, you can view posts on this public blog

    // List all posts. Each post has post owner, title, content.
    let posts = await Post.findAll({
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
        res.json({ err });
        return;
    });
    if (!posts) posts = [];

    const postsWrapper = {
        posts,
        pageTitle: global.CONSTANT_SITE_TITLE,
        username: req.session && req.session.user ? req.session.user.username : null
    };

    res.render('homepage', postsWrapper);
    // Homepage of all public posts
});

router.get('/dashboard', async(req, res) => {
    // User must be logged in to view their own posts
    if (!req.session.loggedIn) {
        // res.redirect('/login?callback=/dashboard');
        res.redirect('/app/community-blogs/login');
        return;
    }

    const { userId } = req.session.user;

    let posts = await Post.findAll({
        // attributes: ["id"]
        where: {
            user_id: userId
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
        res.json({ err });
        return;
    });

    const postsWrapper = {
        posts,
        userId,
        pageTitle: "Your Dashboard",
        username: req.session && req.session.user ? req.session.user.username : null
    };

    // View their own posts
    res.render('dashboard', postsWrapper);
});

router.get('/posts/new', (req, res) => {
    // User must be logged in to create a post
    if (!req.session.loggedIn) {
        res.redirect('/app/community-blogs/login');
        return;
    }

    let dataStraightThrough = {};
    dataStraightThrough.pageTitle = "Your Dashboard";

    res.render('post-new', dataStraightThrough);
});

router.get('/posts/:postId', async(req, res) => {
    // User can view post regardless if logged in.
    const { postId } = req.params;

    // Regardless user is logged in or not, either way, they can see a public post

    // Grab User ID if user is logged in
    const userId = req.session && req.session.loggedIn ? req.session.user.userId : null;

    // Allow user to comment or not based on if there is User Id
    let canComment = Boolean(userId);

    // Debug:
    // console.log({ userId, postId, canComment });
    // process.exit(0);

    // Multiple points of error possible
    function reportError(err) {
        if (!err) err = "No additional error.";
        res.status(500).json({
            success: 0,
            error: "General catch-all error: Please report to server administrator that GET posts/:postId failed.",
            additionalError: err
        });
    }

    let onePost = await Post.findOne({
        attributes: ["id", ["user_id", "userId"], "title", "content", "createdAt", "updatedAt"],
        where: {
            id: postId
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

        // Debug:
        // console.log({ row });
        // process.exit(0);

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
        reportError(err);

        // Redirect back to homepage's public posts
        res.redirect("/app/community-blogs/");
    });

    // As usual, render username next to Logout link if logged in
    const loggedInUsername = req.session && req.session.user ? req.session.user.username : null
    if (onePost) {
        onePost.canComment = canComment;
        onePost.username = loggedInUsername;
        onePost.pageTitle = global.CONSTANT_SITE_TITLE
        res.render('post-view', onePost);
    } else {
        res.render('post-missing', { pageTitle: global.CONSTANT_SITE_TITLE, username: loggedInUsername });
    }
});

router.get('/posts/:postId/preview', async(req, res) => {
    // User must be logged in to preview their post for editing or deleting
    if (!req.session.loggedIn) {
        res.redirect('/app/community-blogs/login');
        return;
    }

    const { postId } = req.params;
    const { userId, username } = req.session.user;

    let post = await Post.findOne({
        attributes: ["id", "title", "content"],
        where: {
            id: postId,
            user_id: userId
        }
    }).then(row => {
        row = row.toJSON();

        return row;
    }).catch(err => {
        res.status(500).json({ error: "General catch-all error: Please report to server administrator GET /posts/:postId/preview failed." });
        return;
    });

    if (post) {

        let { title, content } = post;

        let postWrapper = {
            postId,
            userId,
            title,
            content,
            username
        };
        postWrapper.pageTitle = "Your Dashboard";
        res.render('post-preview', postWrapper);
    } else {
        res.status(500).json({ error: "General catch-all error: Please report to server administrator GET /posts/:postId/preview failed." });
    }
});

router.get('/login', (req, res) => {
    // If already logged in, then homepage
    if (req.session.loggedIn) {
        res.redirect('/app/community-blogs/');
        return;
    }

    let dataStraightThrough = {};
    dataStraightThrough.pageTitle = global.CONSTANT_SITE_TITLE;
    dataStraightThrough.pageTitle = req.session && req.session.user ? req.session.user.username : null;

    res.render("login", dataStraightThrough);
});

router.get('/signup', (req, res) => {
    let dataStraightThrough = {};
    dataStraightThrough.pageTitle = global.CONSTANT_SITE_TITLE;
    dataStraightThrough.pageTitle = req.session && req.session.user ? req.session.user.username : null;

    res.render("signup", dataStraightThrough);
});

router.get('/logout', (req, res) => {
    res.redirect("/app/community-blogs/api/logout");
});

module.exports = router;