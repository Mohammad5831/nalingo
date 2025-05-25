const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce((sum, item) => sum + item.Course.price, 0);
}

module.exports = {
    calculateTotalPrice,
};