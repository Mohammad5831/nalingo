const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User')

const Cart = sequelize.define('Cart', {
    cartId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cartUUID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'userId'
        },
    }
}, {
    timestamps: false,
});

module.exports = Cart;