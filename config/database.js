const sequelize = require('sequelize');
const db = new sequelize('Node', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
});
module.exports = db;