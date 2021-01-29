const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// Workaround when you're at /post/:postId, and clicking another link like /dashboard goes to /post/dashboard
// Then it will redirect one level up to get rid of /post so you can arrive to /dashboard
router.get('/posts/posts', (req, res) => {
    res.redirect("../posts");
    return;
});
router.get('/posts/login', (req, res) => {
    res.redirect("../login");
    return;
});
router.get('/posts/signup', (req, res) => {
    res.redirect("../signup");
    return;
});
router.get('/posts/dashboard', (req, res) => {
    res.redirect("../dashboard");
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
        console.log({ err });
        res.json({ err });
    });
    if (!posts) posts = [];

    const postsWrapper = {
        posts,
        pageTitle: "The Tech Blog"
    };

    res.render('homepage', postsWrapper);
    // Homepage of all public posts
});

router.get('/dashboard', (req, res) => {
    // User must be logged in to view their own posts
    if (!req.session.loggedIn) {
        res.redirect('/login');
        return;
    }

    // View their own posts
    res.render('dashboard');
});

router.get('/posts/new', (req, res) => {
    // User must be logged in to create a post
    if (!req.session.loggedIn) {
        res.redirect('/login');
        return;
    }

    res.render('post-new');
});

router.get('/posts/:postId', (req, res) => {
    // User can view post regardless if logged in.
    // Only they cannot comment if not logged in
    let attachObject = {
        loggedIn: req.session.loggedIn
    }

    res.render('post-view');
});

router.get('/posts/:postId/preview', (req, res) => {
    // User must be logged in to preview their post for editing or deleting
    if (!req.session.loggedIn) {
        res.redirect('/login');
        return;
    }

    res.render('post-preview');
});

router.get('/login', (req, res) => {
    // If already logged in, then homepage
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    let postStraightThrough = {};
    postStraightThrough.pageTitle = "The Tech Blog";

    res.render("login", postStraightThrough);
});

router.get('/signup', (req, res) => {
    let postStraightThrough = {};
    postStraightThrough.pageTitle = "The Tech Blog";

    res.render("signup", postStraightThrough);
});

module.exports = router;