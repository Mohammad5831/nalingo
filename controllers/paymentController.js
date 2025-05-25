const zarinpal = require('zarinpal-checkout');
const { getOrCreateCart, getCartItemsByCartId } = require('../services/cartService');
const { calculateTotalPrice } = require('../utilities/totalPriceService');
const { existingUserByUUID } = require("../services/authService");
const { createdEnrollment, existingEnrolment } = require('../services/paymentService');
require('dotenv').config();

const ZARINPAL = zarinpal.create(process.env.MERCHANT_ID, true);

// درخواست پرداخت
const requestPayment = async (req, res) => {
    try {
        const userUUID = req.user?.userId;
        const user = await existingUserByUUID(userUUID);
        if (!user) return res.status(404).json({ message: 'کاربر یافت نشد' });

        const cart = await getOrCreateCart(user.userId);
        if (!cart) return res.status(404).json({ message: 'سبد خرید پیدا نشد' });

        const cartItems = await getCartItemsByCartId(cart.cartId);
        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: 'دوره‌ای در سبد خرید نیست' });
        }

        const totalPrice = await calculateTotalPrice(cartItems);
        if (totalPrice <= 0) {
            return res.status(400).json({ message: 'مبلغ پرداخت معتبر نیست' });
        }

        const response = await ZARINPAL.PaymentRequest({
            Amount: totalPrice,
            CallbackURL:`${process.env.CALLBACK_URL}/api/payment/verify`,
            Description: "پرداخت برای خرید دوره‌ها",
            Email: req.body?.email,
        });

        if (response.status === 100) {
            res.status(200).json({ authority: response.authority, url: response.url });
        } else {
            res.status(400).json({ message: "خطا در اتصال به درگاه پرداخت." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطا در پردازش پرداخت." });
    }
};

// بررسی و تأیید پرداخت
const verifyPayment = async (req, res) => {
    const userUUID = req.user?.userId;
    const { Authority, Status } = req.query;

    if (Status !== "OK") {
        return res.status(400).json({ message: "پرداخت لغو شد." });
    }

    try {
        const user = await existingUserByUUID(userUUID);
        if (!user) return res.status(404).json({ message: 'کاربر یافت نشد' });

        const cart = await getOrCreateCart(user.userId);
        if (!cart) return res.status(404).json({ message: 'سبد خرید پیدا نشد' });

        const cartItems = await getCartItemsByCartId(cart.cartId);
        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: 'دوره‌ای در سبد خرید نیست' });
        }

        const totalPrice = await calculateTotalPrice(cartItems);
        if (totalPrice <= 0) {
            return res.status(400).json({ message: 'مبلغ پرداخت معتبر نیست' });
        }

        const result = await ZARINPAL.PaymentVerification({
            Amount: totalPrice,
            Authority,
        });

        const alreadyBought = [];
        for (const courseItem of cartItems) {
            const enrollment = await existingEnrolment(courseItem.courseId, user.userId);
            if (enrollment) {
                alreadyBought.push(courseItem.courseName);
            }
        }

        if (alreadyBought.length > 0) {
            return res.status(409).json({
                message:`دوره‌های زیر قبلاً خریداری شده‌اند: ${alreadyBought.join(', ')}`,
            });
        }

        if (result.Status === 100) {
            for (const item of cartItems) {
                await createdEnrollment(user.userId, item.courseId, result.ref_id);
            }

            await cart.destroy();

            res.status(200).json({ message: "پرداخت موفق بود", refId: result.ref_id });
        } else {
            res.status(400).json({ message: "پرداخت ناموفق بود." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطا در بررسی پرداخت." });
    }
};


module.exports = {
    requestPayment,
    verifyPayment,
};