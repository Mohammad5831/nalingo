const zarinpal = require('zarinpal-checkout');
const { getOrCreateCart, getCartItemsByCartId } = require('../services/cartService');
const { calculateTotalPrice } = require('../utilities/totalPriceService');
const { existingUserByUUID } = require("../services/authService");
const { createdEnrollment, createdTransaction, updatedTransactionByUUID, cancelledTransaction } = require('../services/paymentService');
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
        };
        const totalPrice = await calculateTotalPrice(cartItems);
        if (totalPrice <= 0) {
            return res.status(400).json({ message: 'مبلغ پرداخت معتبر نیست' });
        }
        console.log(totalPrice);

        const response = await ZARINPAL.PaymentRequest({
            Amount: totalPrice,
            CallbackURL: `${process.env.CALLBACK_URL}`,
            Description: "درگاه پرداخت وبسایت نالینگو",
        });

        const { status, authority, url } = response;
        let transactionUUID;
        if (status === 100) {
            for (const item of cartItems) {
                transactionUUID = await createdTransaction(user.userId, item.courseId, item.price, authority)
            }
            return res.status(201).json({
                succses: true,
                message: 'اتصال به درگاه پرداخت موفق بود',
                authority: authority,
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
    const { authority, transactionId } = req.body;

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

        const response = await ZARINPAL.PaymentVerification({
            Amount: totalPrice,
            Authority: authority,
        });

        const { status, cardPan, refId, fee } = response;
        if (status === 100) {
            for (const item of cartItems) {
                await createdEnrollment(user.userId, item.courseId, refId);
                await updatedTransactionByUUID(transactionId, cardPan, item.Course.price, refId, fee);
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
            return res.status(200).json({ message: 'پرداخت موفق نبود' });
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