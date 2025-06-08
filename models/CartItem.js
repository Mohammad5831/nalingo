const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const Cart = require('./Cart');
const Course = require('./Course')

const CartItem = sequelize.define('CartItem', {
    cartId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Cart,
            key: 'cartId',
        }
    },
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Course,
            key: 'courseId',
        }
    }
} , 
    { timestamps: true },
);

module.exports = CartItem;