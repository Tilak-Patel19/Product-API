const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
    },
    description: {
        type: Sequelize.TEXT,
    },
    status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
    }
}, {
    modelName: 'Product'
});

module.exports = Product;