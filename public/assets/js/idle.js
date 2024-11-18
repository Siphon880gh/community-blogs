idle({
    idle: 60000,
    onIdle: function() {
        let isLoggedIn = $(".loggedInUser").length;
        if (isLoggedIn)
            alert("You will be logged out for inactivity after 1 minute.");
    }
}).start();

idle({
    idle: 120000,
    onIdle: function() {
        let isLoggedIn = $(".loggedInUser").length;
        if (isLoggedIn) {
            alert("Logging out for inactivity...");
            document.location.href = "/app/community-blogs/logout";
        }
    }
}).start();