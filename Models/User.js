const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM('active', 'banned'),
        defaultValue: 'active',
    },
    role: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
    }
}, {
    modelName: 'User'
});

module.exports = User;