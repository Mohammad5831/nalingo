const { Redis } = require("../models")


const setData = async (phoneNumber, password, otp) => {
    const data = await Redis.create({
        phoneNumber,
        password,
        otp,
    });

    deleteRowAfterDelay(data.phoneNumber, 300000) //300000 ms = 5 minut   change
};

// تابع برای حذف ردیف
const deleteRowAfterDelay = async (phoneNumber, delayInMilliseconds) => {
    setTimeout(async () => {
        try {
            const row = await Redis.findOne({
                where: { phoneNumber }
            });
            if (row) {
                await row.destroy();
                console.log(`ردیف با شماره ${phoneNumber} با موفقیت حذف شد.`);
            } else {
                console.log(`ردیف با شماره ${phoneNumber} یافت نشد.`);
            }
        } catch (error) {
            console.error('خطا در حذف ردیف:', error);
        }
    }, delayInMilliseconds);
};

const getData = async (phoneNumber) => {
    const data = await Redis.findOne({
        where: { phoneNumber },
    });

    return data;
};

module.exports = {
    setData,
    getData,
};