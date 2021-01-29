const router = require('express').Router();
const bcrypt = require('bcrypt');
const { Post, User, Comment } = require('../../models');

router.post('/comments', (req, res) => {
    // User must be logged in to post comment
    if (!req.session.loggedIn) {
        res.status(403).json({ error: "403 Forbidden Resource. User not logged in." });
        return;
    }

    // TODO: At the template, content is from #add-comment-input textarea
    const { postId, content } = req.body;
    const { userId, username } = req.session.user;

    res.json({ todo: "Coming soon" });
});


router.get('/posts', (req, res) => {
    // User can view posts regardless if logged in.
    res.json({ todo: "Coming soon" });
});

router.get('/dashboard', (req, res) => {
    // User must be logged in to view their own posts
});

router.post('/posts', (req, res) => {
    // User must be logged in to make post
    if (!req.session.loggedIn) {
        res.status(403).json({ error: "403 Forbidden Resource. User not logged in." });
        return;
    }

    // TODO: At the template, content is from #add-comment-input textarea
    const { title, content } = req.body;
    const { userId, username } = req.session.user;

    res.json({ todo: "Coming soon" });
});

router.get('/posts/:postId', (req, res) => {
    // User can view specific post regardless if logged in.

    const { userId, username } = req.session.user;

    res.json({ todo: "Coming soon" });
});

router.put('/posts/:postId', (req, res) => {
    // User must be logged in to edit their post
    if (!req.session.loggedIn) {
        res.status(403).json({ error: "403 Forbidden Resource. User not logged in." });
        return;
    }

    const { title, content } = req.body;
    const { userId, username } = req.session.user;

    res.json({ todo: "Coming soon" });
});

router.delete('/posts/:postId', (req, res) => {
    // User must be logged in to delete their post
    if (!req.session.loggedIn) {
        res.status(403).json({ error: "403 Forbidden Resource. User not logged in." });
        return;
    }

    const { title, content } = req.body;
    const { userId, username } = req.session.user;

    res.json({ todo: "Coming soon" });
});

router.post('/login', async(req, res) => {
    // User logging in
    // TODO: User logging in

    const { username, password } = req.body;

    let row = await User.findOne({
        where: {
            username
        }
    }).then(async(row) => {
        if (row) row = row.get({ plain: true });

        const plainPassword = password;
        const hash = row.password;
        let passwordMatch = bcrypt.compareSync(plainPassword, hash);

        if (passwordMatch) return row;
        else return null;
    }).catch(err => {
        console.log({ err });
    });

    // console.log({ row });
    // process.exit(0);

    if (row) {
        const dbUserData = row;

        // Start session:
        console.log({ dbUserData });

        req.session.loggedIn = 1;
        req.session.user = {
            userId: dbUserData.id,
            username: dbUserData.username
        };

        res.json({ loggedIn: 1 });
    } else {
        res.json({ loggedIn: 0 });
    }

});

router.post('/signup', (req, res) => {
    // Signing up
    // TODO: Signing up
    // res.render("signup");
});

router.get('/logout', (req, res) => {
    // User logging out
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            // res.status(204).json({ loggedIn: 0 });
            res.status(204).redirect("../login");
        });
    } else {
        // res.status(404).json({ loggedIn: 0 });
        res.status(404).redirect("../login");
    }
});

module.exports = router;