const router = require('express').Router();

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

router.post('/login', (req, res) => {
    // User logging in
    // TODO: User logging in
    res.render("login");
});

router.post('/signup', (req, res) => {
    // Signing up
    // TODO: Signing up
    res.render("signup");
});

router.get('/logout', (req, res) => {
    // User logging out
    // TODO: User logging out
    res.json({ todo: "Coming soon" });
});

module.exports = router;