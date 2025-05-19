const redisClient = require('../config/redisClient');
const Kavenegar = require('kavenegar');
const api = Kavenegar.KavenegarApi({ apikey: process.env.KAVEN_EGAR_API_KEY });
require('dotenv').config();

const saveTempData = async (key, ttl, data) => {
    const stringData = JSON.stringify(data);
    await redisClient.setEx(key, ttl, stringData);
};

const getTempData = async (key) => {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
};

const deleteTempData = async (key) => {
    await redisClient.del(key);
};

// Create OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// send sms
const sendSms = async (phoneNumber, message) => {
    try {
        await api.Send({ message: message, sender: "2000660110", receptor: phoneNumber });

    } catch (error) {
        console.error('ارسال پیامک با مشکل مواجه شد', error.message);
    }
};

// generate and send otp
const sendOtpToPhone = async (phoneNumber) => {
    const otp = generateOtp();

    await saveTempData(`otp: ${phoneNumber}`, 300, otp); // Save for 5 minutes

    const message = `کد ورود شما: ${otp}`;
    await sendSms(phoneNumber, message);

    console.log(`OTP send to ${phoneNumber}: ${otp}`);
    return otp;
};


// verify otp code
const verifyOtpCode = async (phoneNumber, code) => {
    const savedCode = await getTempData(`otp: ${phoneNumber}`);

    if (!savedCode) {
        return {
            valid: false,
            reason: 'expired'
        };
    };

    if (savedCode !== code) {
        return {
            valid: false,
            reason: 'wrong'
        };
    };
    await redisClient.del(`otp: ${phoneNumber}`);
    return {
        valid: true
    };
};

module.exports = {
    saveTempData,
    getTempData,
    deleteTempData,
    sendOtpToPhone,
    verifyOtpCode,
}