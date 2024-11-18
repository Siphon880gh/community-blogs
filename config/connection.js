const Sequelize = require('sequelize');

require('dotenv').config();

// create connection to our db
// JAWSDB_URL only for Heroku. May leave conditional intact even if not using Heroku
const sequelize = process.env.JAWSDB_URL ?
    new Sequelize(process.env.JAWSDB_URL) :
    new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'localhost',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306
    });

module.exports = sequelize;