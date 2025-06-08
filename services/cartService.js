const { Cart, CartItem, Course } = require('../models');

const getOrCreateCart = async (userId) => {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
        cart = await Cart.create({ userId });
    }
    return cart;
};

const createCartItem = async (cartId, courseId) => {
    await CartItem.create({
        cartId,
        courseId,
    });
};

const getCartItem = async (cartId, courseId) => {
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
            attributes: ['courseName', 'price'],
        }
    });

    return cartItems;
};


module.exports = {
    getOrCreateCart,
    createCartItem,
    getCartItem,
    getCartItemsByCartId,
}