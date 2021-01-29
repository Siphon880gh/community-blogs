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
        debugger;
        alert("Viewing post 1");
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