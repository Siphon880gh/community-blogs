const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    // Whether or not logged in, you can view posts on this public blog
    res.redirect('/homepage');
});

router.get('/homepage', (req, res) => {
    // Homepage of all public posts
    res.render('homepage');
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

    res.render('login');
});

module.exports = router;