const { Email } = require("../models")


const createdEmail = async (emailAddress) => {
    await Email.create({
        emailAddress
    });
};

const existingEmail = async (emailAddress) => {
    const email = await Email.findOne({ where: {emailAddress}});
    return email;
};

const findAllEmails = async () => {
    const emails = await Email.findAll({
        attributes: ['emailAddress'],
    });
    return emails
}
module.exports = {
    createdEmail,
    existingEmail,
    findAllEmails,
}