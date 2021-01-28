if (!Handlebars) alert("Load Handlebars before routes.js");

//setup routes
crossroads.addRoute('homepage');
crossroads.addRoute('dashboard');
crossroads.addRoute('logout');

//route listeners
function parseHash(newHash, oldHash) {
    crossroads.parse(newHash);
    switch (newHash) {
        case "homepage/":
            res.render("#homepage", {
                a: 1
            })
            break;
        case "dashboard/":
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

                res.render("#dashboard", postsWrapper, helpersArr);
            })
            break;
        case "login/":
            break;
        case "logout/":
            break;
    }
}
hasher.initialized.add(parseHash); //parse initial hash
hasher.changed.add(parseHash); //parse hash changes
hasher.init(); //start listening for history change