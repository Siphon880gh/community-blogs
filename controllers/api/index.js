const router = require('express').Router();
const bcrypt = require('bcrypt');
const { Post, User, Comment } = require('../../models');

router.post('/posts/:postId/comments', async(req, res) => {
    // User must be logged in to post comment
    if (!req.session.loggedIn) {
        res.status(403).json({ error: "403 Forbidden Resource. User not logged in." });
        return;
    }

    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = req.session.user;

    // Debug
    // console.log({ postId, body: req.body, userId });
    // process.exit(0);

    let commentCreated = await Comment.create({
            content,
            user_id: userId,
            post_id: postId
        }).then(row => row.toJSON())
        .catch(err => {
            res.status(403).json({ success: 0, error: "General catch-all error: Please report to server administrator that POST api/posts/:postId/comments failed." });
            return;
        });
    if (commentCreated) {
        res.json({ success: 1 });
    } else {
        res.status(403).json({ success: 0, error: "Error: Unable to create comment. Likely your session expired." });
    }
});


router.get('/posts', (req, res) => {
    // User can view posts regardless if logged in.
    res.json({ todo: "Coming soon" });
});

router.post('/posts', async(req, res) => {
    // User must be logged in to make post
    if (!req.session.loggedIn) {
        res.status(403).json({ error: "403 Forbidden Resource. User not logged in." });
        return;
    }

    const { title, content } = req.body;
    const { userId, username } = req.session.user;

    // console.log({ title, content, userId, username });
    // process.exit(0);

    let postCreated = await Post.create({
        title,
        content,
        user_id: userId
    }).then(row => {
        return row;
    }).catch(err => {
        res.status(500).json({ error: err });
        return;
    });
    if (postCreated) {
        res.status(200).json({ success: postCreated }).redirect("/app/community-tech-blogs/dashboard");
    } else {
        res.status(500).json({ error: "General catch-all error: Please report to server administrator POST /posts failed." });
    }
});

router.get('/posts/:postId', (req, res) => {
    // User can view specific post regardless if logged in.

    const { userId, username } = req.session.user;

    res.json({ todo: "Coming soon" });
});

router.put('/posts/:postId', async(req, res) => {
    // User must be logged in to edit their post
    if (!req.session.loggedIn) {
        res.status(403).json({ error: "403 Forbidden Resource. User not logged in." });
        return;
    }

    // Grab relevant data
    const { title, content, postId } = req.body;
    const { userId, username } = req.session.user;

    // Multiple points of error possible
    function reportError(err) {
        if (!err) err = "No additional error.";
        res.status(500).json({
            success: 0,
            error: "General catch-all error: Most likely unauthorized editing or database error. Please report to server administrator.",
            additionalError: err
        });
    }

    // This request can fail for reasons of unauthorized editing or database error
    let fail = false;

    // This variable will store successfully edited post. Has to be declared here, otherwise scoping problems.
    let editedPost = null;

    // Can the current user edit this post?
    let isAllowedEdit = await Post.findOne({
        where: {
            user_id: userId,
            id: postId
        }
    }).then(row => {
        if (row) row = row.get({ plain: true });
        return row;
    }).catch(err => {
        reportError(err);
        return;
    });
    if (isAllowedEdit) {
        // Then save the post edit
        editedPost = await Post.update({
            title,
            content
        }, {
            where: {
                user_id: userId,
                id: postId
            }
        }).catch(err => {
            reportError(err);
            return;
        });
        if (!editedPost)
            fail = true;
    } else {
        // Not allowed writing access because post does not belong to user
        fail = true;
    }

    // If user has no permission or post edit fails
    if (fail)
        reportError();
    else
        res.json({ success: 1, editedPost });
});

router.delete('/posts/:postId', async(req, res) => {
    // User must be logged in to delete their post
    if (!req.session.loggedIn) {
        res.status(403).json({ error: "403 Forbidden Resource. User not logged in." });
        return;
    }

    // Grab relevant data
    const { postId } = req.body;
    const { userId } = req.session.user;

    // Multiple points of error possible
    function reportError(err) {
        if (!err) err = "No additional error.";
        res.status(500).json({
            success: 0,
            error: "General catch-all error: Most likely unauthorized deleting or database error. Please report to server administrator.",
            additionalError: err
        });
    }

    // This request can fail for reasons of unauthorized deleting or database error
    let fail = false;

    // This variable will store successfully deleted post information. Has to be declared here, otherwise scoping problems.
    let deletedPost = null;

    // Can the current user delete this post?
    const isAllowedDelete = await Post.findOne({
        where: {
            user_id: userId,
            id: postId
        }
    }).then(row => {
        if (row) row = row.get({ plain: true });
        return row;
    }).catch(err => {
        reportError(err);
        return;
    });
    if (isAllowedDelete) {
        // Then delete the post
        deletedPost = await Post.destroy({
            where: {
                user_id: userId,
                id: postId
            }
        }).catch(err => {
            reportError(err);
            return;
        });
        if (!deletedPost)
            fail = true;
    } else {
        fail = true;
    }

    // If user has no permission or post deletion fails
    if (fail)
        reportError();
    else
        res.json({ success: 1, deletedPost });
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
        return;
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
        res.status(500).json({ loggedIn: 0, error: "General catch-all error: Most likely this username is taken already." });
        return;
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
        res.json({ loggedIn: 0, error: "General catch-all error: Most likely this username is taken already." });
    }

});

router.get('/logout', (req, res) => {
    // User logging out
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            // res.status(204).json({ loggedIn: 0 });
            res.status(204).redirect("/app/community-tech-blogs/login");
        });
    } else {
        // res.status(404).json({ loggedIn: 0 });
        res.status(404).redirect("/app/community-tech-blogs/login");
    }
});

module.exports = router;