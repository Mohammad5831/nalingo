const { Cart, CartItem, Course } = require('../models');

const getCart = async (userId) => {
    const cart = await Cart.findOne({ where: { userId } });
    return cart;
};

const createdCart = async (userId) => {
    const cart = await Cart.create({ userId });
    return cart;
};

const createCartItem = async (cartId, courseId) => {
    await CartItem.create({
        cartId,
        courseId,
    });
};

const getCartItem = async ( courseId, cartId) => {
    const cartItem = await CartItem.findOne({
        where: { courseId, cartId },
    });
    return cartItem;
};

const getCartItemsByCartId = async (cartId) => {
    const cartItems = await CartItem.findAll({
        where: { cartId },
        attributes: {
            exclude: ['cartId'],
        },
        include: {
            model: Course,
            attributes: ['courseUUID','courseName', 'price'],
        }
    });

    return cartItems;
};


module.exports = {
    getCart,
    createdCart,
    createCartItem,
    getCartItem,
    getCartItemsByCartId,
}