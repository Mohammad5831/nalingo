const { createdEmail, existingEmail, findAllEmails } = require("../services/emailService");
const sendEmail = require("../utilities/mailerUtil");


const createEmail = async (req, res) => {
    try {
        const { emailAddress } = req.body;

        const emailExsist = await existingEmail(emailAddress);
        if (emailExsist) return res.status(409).json({success: false, message: 'ایمیل تکراری است' });
        await createdEmail(emailAddress);

        return res.status(201).json({success: true, message: 'ایمیل با موفقیت ذخیره شد' })
    } catch (error) {
        return res.status(500).json({success: false, message: 'خطا در ذخیره کردن ایمیل' });
    };
};

const sendMassEmail = async (req, res) => {
    try {
        const { subject, text } = req.body;

        const emails = await findAllEmails();
        if (!emails) return res.sta(404).json({success: false, message: 'ایمیلی پیدا نشد' });

        const emailPromises = emails.map(email => {
            sendEmail(email.emailAddress, subject, text)
            }
        );
        await Promise.all(emailPromises);

        return res.status(200).json({success: true, message: 'پیام با موفقیت به ایمیل ها ارسال شدند' })
    } catch (error) {
        return res.status(500).json({success: false, message: 'خطا در ارسال پیام به ایمل ها' })
    }
}

module.exports = {
    createEmail,
    sendMassEmail,
};