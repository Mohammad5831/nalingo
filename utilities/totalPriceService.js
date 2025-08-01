const calculateTotalPrice = async (cartItems) => {
    return await cartItems.reduce((sum, item) => sum + item.Course.price, 0);
}

module.exports = {
    calculateTotalPrice,
};