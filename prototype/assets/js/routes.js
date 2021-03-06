// Check dependencies
if (!Handlebars) alert("Error Dependencies: Load Handlebars before routes.js");
if (!signals) alert("Error Dependencies: Load signals before routes.js")
if (!window.res.render) alert("Error Dependencies: Load res.render.js before routes.js")

// Setup routes
crossroads.addRoute('/')
    .matched.add(() => {
        hasher.setHash('homepage');
    }); // matched

crossroads.addRoute('homepage')
    .matched.add(() => {
        $.get("mocks/homepage/posts.json", (data) => {
            const postsWrapper = {
                posts: data,
                pageTitle: "The Tech Blog"
            };
            const helpersArr = [{
                name: "date",
                fxn: function(options) {
                    const sqlDate = options;
                    const humanDate = moment(sqlDate).format("MM/DD/YYYY")
                    return humanDate;
                }
            }]

            // Render with data context and helpers
            res.render("#homepage", postsWrapper, helpersArr);
        }); // ajax
    }); // matched

crossroads.addRoute('dashboard')
    .matched.add(() => {
        $.get("mocks/dashboard/posts.json", (data) => {
            const postsWrapper = {
                posts: data,
                pageTitle: "Dash Board"
            };
            const helpersArr = [{
                name: "date",
                fxn: function(options) {
                    const sqlDate = options;
                    const humanDate = moment(sqlDate).format("MM/DD/YYYY")
                    return humanDate;
                }
            }]

            // Render with data context and helpers
            res.render("#dashboard", postsWrapper, helpersArr);
        }); // ajax
    }); // matched

crossroads.addRoute('login')
    .matched.add(() => {
        var genericData = {
            pageTitle: "The Tech Blog"
        }
        res.render("#login", genericData);
    });

crossroads.addRoute('signup')
    .matched.add(() => {
        var genericData = {
            pageTitle: "The Tech Blog"
        }
        res.render("#signup", genericData);
    });

crossroads.addRoute('logout')
    .matched.add(() => {
        alert("Prototype: Would be logging out.");
    });

// This route must be placed before posts/:postId
crossroads.addRoute('posts/new')
    .matched.add(() => {
        console.log('Route', 'posts/new');

        var genericData = {
            pageTitle: "Dashboard"
        }

        // Render with data context and helpers
        res.render("#post-new", genericData);
    }); // matched

crossroads.addRoute('posts/{postId}')
    .matched.add((postId) => {
        // When refactored: postId will be in Post.findAll.. WHERE
        // As prototype: We will just grab postId=1 regardless
        $.get("mocks/post-view/post.json", (data) => {
            let postStraightThrough = data;
            postStraightThrough.pageTitle = "The Tech Blog";
            const helpersArr = [{
                name: "date",
                fxn: function(options) {
                    const sqlDate = options;
                    const humanDate = moment(sqlDate).format("MM/DD/YYYY")
                    return humanDate;
                }
            }];
            // debugger;

            // Render with data context and helpers
            res.render("#post-view", postStraightThrough, helpersArr);
        }); // ajax
    }); // matched

// Preview post before deciding to edit or delete
crossroads.addRoute('posts/{postId}/preview')
    .matched.add((postId) => {
        console.log('Route', 'posts/{postId}/preview');
        // When refactored: postId will be in Post.findAll.. WHERE
        // As prototype: We will just grab postId=1 regardless
        $.get("mocks/post-preview/post.json", (data) => {
            const postStraightThrough = data;
            postStraightThrough.pageTitle = "The Tech Blog";
            const helpersArr = [{
                name: "date",
                fxn: function(options) {
                    const sqlDate = options;
                    const humanDate = moment(sqlDate).format("MM/DD/YYYY")
                    return humanDate;
                }
            }];
            // debugger;

            // Render with data context and helpers
            res.render("#post-preview", postStraightThrough, helpersArr);
        }); // ajax
    }); // matched

crossroads.addRoute('DELETE/api/posts/{postId}')
    .matched.add((postId) => {
        console.log("DELETE/api/posts/{postId}");
        alert("Prototype: Would delete post by post id");
    }); // matched

crossroads.bypassed.add(function(request) {
    console.log("Route not found. Debug info follows");
    console.log(request);
    debugger;
});

// parseHash is an handler for on history state onready and onchange
function parseHash(newHash, oldHash) {
    // crossroads parse triggers crossroads matched.add
    crossroads.parse(newHash);

    // Update the page title
    setTimeout(() => {

        const $visibleView = $("[data-view]:not(.d-none");
        const newPageTitle = $visibleView.find(".page-title-dynamic").text();
        $(".page-title").text(newPageTitle);
    }, 200);
}

// setup listener for history state onready and onchange
hasher.initialized.add(parseHash); //parse initial hash
hasher.changed.add(parseHash); //parse hash changes
hasher.init(); //start listening for history change