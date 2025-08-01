const changeUserStatus = async (user) => {
    const { firstName, lastName, phoneNumber, email, age } = user;

    if (firstName && lastName && phoneNumber && email && age) {
        await user.update({ status: 'active' });
        const response = user.toJSON();
        delete response.userId;

        return response;
    } else {
        await user.update({ status: 'notactive' });
        const response = user.toJSON();
        delete response.userId;

        return response;
    }
};

module.exports = {
    changeUserStatus,
}