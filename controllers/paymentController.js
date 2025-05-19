const zarinpal = require('zarinpal-checkout');
const { getOrCreateCart, getCartItemsByCartId } = require('../services/cartService');
const { calculateTotalPrice } = require('../utilities/totalPriceService');
const { existingUserByUUID } = require("../services/authService");
const { createdEnrollment, existingEnrolment } = require('../services/paymentService');
require('dotenv').config();

const ZARINPAL = zarinpal.create(process.env.MERCHANT_ID, true);

// Send a request to the payment gateway
const requestPayment = async (req, res) => {
    try {
        const userUUID = req.user?.userId;
        const user = await existingUserByUUID(userUUID);
        // Checking the existence of the shopping cart
        const cart = await getOrCreateCart(user.userId);
        if (!cart) return res.status(404).json({ message: 'سبد خرید پیدا نشد' });

        // Checking the existence of the course in the shopping cart
        const cartItems = await getCartItemsByCartId(cart.cartId);
        if (!cartItems) return res.status(404).json({ message: 'دوره ای پیدا نشد' });

        const totalPrice = await calculateTotalPrice(cartItems);


        // const response = await ZARINPAL.PaymentRequest({
        //     Amount: totalPrice,
        //     CallbackURL: "http://localhost:3000/api/payment/verify",
        //     Description: "پرداخت برای خرید دوره‌ها",
        //     Email: req.body?.email,
        // });
        const response = { status: 100 }

        if (response.status === 100) {
            // res.status(200).json({ authority: response.authority, url: response.url });
            res.status(200).json({ message: 'اتصال به درگاه پرداخت موفق بود' });

        } else {
            res.status(400).json({ message: "خطا در اتصال به درگاه." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطا در پردازش پرداخت." });
    }
};

// Verification of successful payment
const verifyPayment = async (req, res) => {
    const userUUID = req.user?.userId;
    // const { Authority, Status } = req.query;
    const status = 'OK';

    if (status !== "OK") {
        return res.status(400).json({ message: "پرداخت لغو شد." });
    }

    try {
        const user = await existingUserByUUID(userUUID)
        // Checking the existence of the shopping cart
        const cart = await getOrCreateCart(user.userId);
        if (!cart) return res.status(404).json({ message: 'سبد خرید پیدا نشد' });
        // Checking the existence of the course in the shopping cart
        const cartItems = await getCartItemsByCartId(cart.cartId);
        if (!cartItems) return res.status(404).json({ message: 'دوره ای پیدا نشد' });

        const totalPrice = await calculateTotalPrice(cartItems);


        // const result = await ZARINPAL.PaymentVerification({
        //     Amount: totalPrice,
        //     Authority,
        // });
        const result = { status: 100, ref_id: 12305434, };

        for (const courseItem of cartItems) {
            const enrollment = await existingEnrolment(courseItem.courseId, user.userId);
            if (enrollment) {
                return res.status(409).json({ message: `دوره ${courseItem.courseName} قبلا خریداری شده` })
            }
        };

        if (result.status === 100) {
            for (const item of cartItems) {
                await createdEnrollment(user.userId, item.courseId, result.ref_id);
            };
            await cart.destroy();
            res.status(200).json({ message: "پرداخت موفق", refId: result.ref_id });
        } else {
            res.status(400).json({ message: "پرداخت ناموفق بود." });
        };
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطا در بررسی پرداخت." });
    }
};

module.exports = {
    requestPayment,
    verifyPayment,
};