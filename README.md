Community Blogs
====
![Last Commit](https://img.shields.io/github/last-commit/Siphon880gh/community-blogs/master)  <a href="https://www.youtube.com/user/Siphon880yt/" rel="nofollow"><img src="https://camo.githubusercontent.com/0bf5ba8ac9f286f95b2a2e86aee46371e0ac03d38b64ee2b78b9b1490df38458/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f596f75747562652d7265643f7374796c653d666c6174266c6f676f3d796f7574756265266c6162656c436f6c6f723d726564" alt="Linked-In" data-canonical-src="https://img.shields.io/badge/Youtube-red?style=flat&amp;logo=youtube&amp;labelColor=red" style="max-width:100%;"></a>  <a href="https://www.linkedin.com/in/weng-fung/" rel="nofollow" target="_blank"><img src="https://camo.githubusercontent.com/0f56393c2fe76a2cd803ead7e5508f916eb5f1e62358226112e98f7e933301d7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c696e6b6564496e2d626c75653f7374796c653d666c6174266c6f676f3d6c696e6b6564696e266c6162656c436f6c6f723d626c7565" alt="Linked-In" data-canonical-src="https://img.shields.io/badge/LinkedIn-blue?style=flat&amp;logo=linkedin&amp;labelColor=blue" style="max-width:100%;"></a>  <a href="https://www.paypal.com/donate?business=T42BK25TYPZSA&item_name=Buy+me+coffee+%28I+develop+free+apps%29&currency_code=USD" target="_blank" title="Donate to this project using Buy Me A Coffee" alt="Paypal"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>

Description
---
By Weng Fei Fung. Community Blogs is a CMS that lets you and other contributors sign up and post articles. Simple, unimposing, and easily installed. 

The blog times out and logs you out after 2 minutes of idleness.

Demo
---
[Try it out now!](https://community-blogs-wff.herokuapp.com/)

Screenshot
---
![Screenshot animated](README/screenshot-animated.gif)

Table of Contents
---
- [Description](#description)
- [Demo](#demo)
- [Screenshot](#screenshot)
- [Installation](#installation)
- [Customization](#customization)
- [Usage](#usage)
- [Contribution](#contribution)
- [Tests](#tests)
- [Questions](#questions)

Installation
---
1. Run `npm install` to install the node module dependencies.
2. Make sure you have mysql cli installed. Run `mysql -u <USERNAME> -p` and enter password to access the mysql on your localhost or server.
3. Create the database with `source db/schema.sql`. You `quit` now.
4. Optionally, you can run `npm run seed` if you want to have some generic blogs to demo the app. 

Customizing
---
### Site name
1. You can change the website name in the `<title>` at ./views/layouts/main.handlebars if you do not want the theme to surround tech news.
2. Change the website header title at ./controllers/html-routes.js at the variable assignment global.CONSTANT_SITE_TITLE.
3. Optional, but you can also change the database name in MySQL from your own .env file's DB_NAME and the database value in db/schema.sql. Do not forget to run the MySQL shell and resource the schema.sql like in the installations.
### Color themes
You can change the color themes at public/index.css under the section `/* Themes */`. If using new variable names, make sure other CSS rules reflect your new variables.


Usage
---
1. Run `npm start`
2. It will mention the port being listend at. Open your web-browser and go to the localhost:port, eg. localhost:3001
3. Or you can also deploy to other servers such as Heroku (you need the JawsDB addon).

Contribution
---
If you want to contribute, you may want to know the architecture and methodology. 

The database relies on a live MySql server, rather than is on your localhost computer or server. The node module uses Sequelize which connects to the MySql server and can recreate tables, however it cannot recreate databases (hence you had to manually create the dadtabase from db/schema.sql at MySql. My MySql server credentials will likely differ from yours but they are stored in an .env file with variables:
```
DB_NAME=tech_blog_db
DB_USER=<YOUR_MYSQL_SERVER_USERNAME>
DB_PW=<YOUR_MYSQL_SERVER_PASSWORD>
DB_PORT=8889
```

For this community blogs app, we are using a tech blog as an example. You can adjust the names in schema and .env as needed. You will need to create the .env file at the root of the app because for security reasons I did not upload mines.

The PORT is up to you, as long as it is not an used port. I am using 8889 because I have MAMP installed but another port option is 3006.

Again, Sequelize connects to the MySQL server. It creates these models that the app interacts with. This is a node server with Express setting up routes. The routes will connect to the models and Express-Handlebars templating engine to send HTML code to the client's browser to render (`/path/to/resource`). At other times, the Express routes send JSON information (`/api/path/to/resource`).

When developing this app, I used a TDD methodology to mock API routes. I then prototyped a complete single page application using frontend Handlebars JS that is different than Express-Handlebars that runs templates in the backend. However, the frontend templating engine shares the same language and similar templating syntax, so after developing the prototype, I could copy the templates from the frontend over to the backend. I used routes on the prototype to dynamically change the webpage with Crossroads JS, Hasher JS, and Signals, so that after I'm done I can use the prototype's frontend routes as a reference for my HTML routes on the backend. 

After mocking API routes using Jest, testing routes on the prototype, and templating the different webpages, all on the frontend - I then moved peices of code towards the backend to develop a full stack app where Express routes delivers Express-Handlebars templates while communicating JSON information back and from the client. Meanwhile, Sequelize models allow us to conceptulize peices of data using node JS language without disrupting the workflow by switching over to SQL statements.

The testing and prototyping are in the folders __test__, __test2__, and prototype/ folders, and therefore you can ignore those folders when it concerns how the app actually works. But if you want to add more features, you can use the same methodology with these testing and prototyping folders.

Tests
---
There are two test folders: __test__ and __test2__. You can run them respectively, `npm run test` and `npm run test2 <name.of.the.test>`. 

The reason for separating them is that the first test command is meant to run all test suites in __test__, which is what you expect. 

However, at __test2__ each test suite will have to run after dropping and recreating the database (with `source schema/db.sql` in the MySQL2 shell) due to Sequelize not being able to drop databases and that the teste suites need completely fresh setups of the database.

The Jest file matching patterns for __test__ are in package.json, whereas thoes for __test2__ are in the file ./jest.test2.config.json.

Questions
---
- Where can I see more of your repositories?
	- Visit [Siphon880gh's Repositories](https://github.com/Siphon880gh)

- Where can I reach you?
	- You can reach me with additional questions at <a href='mailto:weffung@ucdavis.edu'>weffung@ucdavis.edu</a>.
	- Want to [hire me](https://www.linkedin.com/in/weng-fung/)?