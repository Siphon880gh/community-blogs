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
    .matched.add((postId) => {
        $.get("mocks/homepage/posts.json", (data) => {
            const postsWrapper = {
                posts: data
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
    .matched.add((postId) => {
        $.get("mocks/dashboard/posts.json", (data) => {
            const postsWrapper = {
                posts: data
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

crossroads.addRoute('logout')
    .matched.add((postId) => {
        alert("Prototype: Would be logging out.");
    });

crossroads.addRoute('posts/{postId}')
    .matched.add((postId) => {
        console.log('Route', 'posts/{postId}');
        // When refactored: postId will be in Post.findAll.. WHERE
        // As prototype: We will just grab postId=1 regardless
        $.get("mocks/post-view/post.json", (data) => {
            const postStraightThrough = data;
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

crossroads.addRoute('posts/{postId}/edit')
    .matched.add((postId) => {
        console.log('Route', 'posts/{postId}/edit');
        // When refactored: postId will be in Post.findAll.. WHERE
        // As prototype: We will just grab postId=1 regardless
        $.get("mocks/post-edit/post.json", (data) => {
            const postStraightThrough = data;
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
            res.render("#post-edit", postStraightThrough, helpersArr);
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
}

// setup listener for history state onready and onchange
hasher.initialized.add(parseHash); //parse initial hash
hasher.changed.add(parseHash); //parse hash changes
hasher.init(); //start listening for history change