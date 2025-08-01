const { setData, getData } = require('../services/redisService');
const { Smsir } = require('smsir-js')
require('dotenv').config();
const api_key = process.env.SMS_IR_API_KEY;
const line_number = 9830007732911042;

const sms = new Smsir(api_key, line_number);

const saveTempData = async (phone, pass, otp) => {
    await setData(phone, pass, otp)
};

const getTempData = async (phoneNumber) => {
    const data = await getData(phoneNumber);
    return data;
};

const deleteTempData = async (phoneNumber) => {
    const data = await getData(phoneNumber);
    await data.destroy();
};

// Create OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// // send sms

const sendSms = async (phoneNumber, code) => {
    try {
        const Mobile = phoneNumber;
        const TemplateId = 650684;
        const Parameters = [{
            "name": "OTPCODE",
            "value": `${code}`
        }];
        
        await sms.SendVerifyCode(Mobile, TemplateId, Parameters)
    } catch (error) {
        console.error('ارسال پیامک با مشکل مواجه شد', error.message);
    }
}

// generate and send otp
const sendOtpToPhone = async (phoneNumber) => {
    const otp = generateOtp();

    await sendSms(phoneNumber, otp);
    console.log(`OTP send to ${phoneNumber}: ${otp}`);
    return otp;
};


// verify otp code
const verifyOtpCode = async (phoneNumber, code) => {
    const data = await getData(phoneNumber);

    if (!data) {
        return {
            valid: false,
            reason: 'expired'
        };
    };

    if (data.otp !== code) {
        return {
            valid: false,
            reason: 'wrong'
        };
    };
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