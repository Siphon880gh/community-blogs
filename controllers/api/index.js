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

    if (row) {
        const dbUserData = row;

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

router.post('/signup', async(req, res) => {
    // If user logged in, log user out
    if (req.session.loggedIn) {
        req.session.destroy(() => {});
    }
    const { username, password } = req.body;

    let userCreated = await User.create({
        username,
        password
    }).then(async(row) => {
        if (row) row = row.get({ plain: true });

        // Password is removed
        delete row.password;

        return row;
    }).catch(err => {
        console.log({ err });
        res.json({ loggedIn: 0, error: "General catch all error: Most likely this username is taken already." });
    });

    if (userCreated) {
        // Start session:
        // console.log({ userCreated });

        req.session.loggedIn = 1;
        req.session.user = {
            userId: userCreated.id,
            username: userCreated.username
        };

        res.status(200).json({ loggedIn: 1, userCreated });
    } else {
        res.json({ loggedIn: 0, error: "General catch all error: Most likely this username is taken already." });
    }

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