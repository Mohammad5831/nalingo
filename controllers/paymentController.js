const zarinpal = require('zarinpal-checkout');
const { getCartItemsByCartId, getCart, createdCart } = require('../services/cartService');
const { calculateTotalPrice } = require('../utilities/totalPriceService');
const { existingUserByUUID } = require("../services/authService");
const { createdEnrollment, createdTransaction, updatedTransactionByUUID, cancelledTransaction } = require('../services/paymentService');
const { StudentClass, Class } = require('../models');
const { existingCourseByUUID } = require('../services/courseService');
require('dotenv').config();

const ZARINPAL = zarinpal.create(process.env.MERCHANT_ID, true);

// درخواست پرداخت
const requestPayment = async (req, res) => {
    try {
        const userUUID = req.user?.userId;
        const user = await existingUserByUUID(userUUID);
        if (!user) return res.status(404).json({ success: false, message: 'کاربر یافت نشد' });

        let cart;
        cart = await getCart(user.userId);
        if (!cart) {
            cart = await createdCart(user.userId);
            return res.status(404).json({ success: false, message: 'سبد خرید خالی است' })
        }
        const cartItems = await getCartItemsByCartId(cart.cartId);
        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ success: false, message: 'دوره‌ای در سبد خرید نیست' });
        };
        const totalPrice = await calculateTotalPrice(cartItems);
        if (totalPrice <= 0) {
            return res.status(400).json({ success: false, message: 'مبلغ پرداخت معتبر نیست' });
        }
        let transactionUUID;
        for (const item of cartItems) {
            transactionUUID = await createdTransaction(user.userId, item.courseId, item.price)
        }

        const response = await ZARINPAL.PaymentRequest({
            Merchant_id: process.env.MERCHANT_ID,
            Amount: totalPrice,
            CallbackURL: `${process.env.CALLBACK_URL}/?transactionId=${transactionUUID}`,
            Description: "درگاه پرداخت وبسایت نالینگو",
        });
        const { status, url } = response;
        if (status === 100) {
            return res.status(201).json({
                succses: true,
                message: 'اتصال به درگاه پرداخت موفق بود',
                url: url,
                transactionId: transactionUUID
            });
        } else {
            return res.status(400).json({ succses: false, message: "خطا در اتصال به درگاه پرداخت." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطا در پردازش پرداخت." });
    }
};

// بررسی و تأیید پرداخت
const verifyPayment = async (req, res) => {
    const userUUID = req.user?.userId;
    const { transactionId, Authority, Status } = req.body
    if (Status != 'OK') {
        return res.status(400).json({ success: false, message: 'پرداخت توسط کاربر لغو شد' })
    }

    try {
        const user = await existingUserByUUID(userUUID);
        if (!user) return res.status(404).json({ success: false, message: 'کاربر یافت نشد' });

        let cart;
        cart = await getCart(user.userId);
        if (!cart) {
            cart = await createdCart(user.userId);
            return res.status(404).json({ success: false, message: 'سبد خرید خالی است' })
        }
        const cartItems = await getCartItemsByCartId(cart.cartId);
        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: 'دوره‌ای در سبد خرید نیست' });
        }

        const totalPrice = await calculateTotalPrice(cartItems);
        if (totalPrice <= 0) {
            return res.status(400).json({ success: false, message: 'مبلغ پرداخت معتبر نیست' });
        }

        const response = await ZARINPAL.PaymentVerification({
            Merchant_id: process.env.MERCHANT_ID,
            Amount: totalPrice,
            Authority,
        });

        const { status, cardPan, refId, fee } = response;
        if (status === 100) {
            for (const item of cartItems) {
                await createdEnrollment(user.userId, item.courseId, refId);
                await updatedTransactionByUUID(transactionId, cardPan, item.Course.price, refId, fee, Authority);
                if (item.courseType === 'online') {
                    await signupStudentToOnlineCourse(item.courseId, user.userId)
                }
            }
            await cart.destroy();
            return res.status(200).json({
                succses: true,
                message: "پرداخت موفق بود",
                refId: refId
            });
        } else if (status === 101) {
            return res.status(200).json({
                succses: true,
                message: "پرداخت موفق بود",
                refId: refId
            });
        } else {
            await cancelledTransaction(transactionId)
            return res.status(200).json({ success: false, message: 'پرداخت موفق نبود' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "خطا در بررسی پرداخت." });
    }
};

const signupStudentToOnlineCourse = async (courseId, userId) => {
    //***************

    const classData = await Class.findOne({
        where: { courseId },
    });
    if (!classData) {
        return res.status(400).json({ success: false, message: 'اطلاعات کلاس موردنظر پیدا نشد' });
    };
    const studentClassNumber = await StudentClass.count({
        where: { classId: classData.classId }
    });
    if (studentClassNumber === classData.maxStudent) {
        return res.status(200).json({ success: true, message: 'عضویت درکلاس امکان پذیر نیست , ظرفیت کلاس تکمیل است' })
    }
    await StudentClass.create({
        classId: classData.classId,
        userId
    })
    
    //****************
};

module.exports = {
    requestPayment,
    verifyPayment,
};