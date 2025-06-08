const { existingUserByUUID } = require('../services/authService');
const { existingCourseByUUID } = require('../services/courseService');
const { getOrCreateCart, createCartItem, getCartItem, getCartItemsByCartId } = require('../services/cartService');
const { calculateTotalPrice } = require('../utilities/totalPriceService');
const { createdEnrollment, existingEnrolment } = require('../services/paymentService');

// Add course to cart
const addCourseToCart = async (req, res) => {
    try {
        const userUUID = req.user?.userId;
        const { courseUUID } = req.params;

        if (req.user.role === 'teacher') {
            return res.status(403).json({ message: 'اساتید توانایی خرید دوره را ندارند , لطفا با یک اکانت معمولی مجددا تلاش بفرمایید' })
        };
        // Checking the existence of the user
        const user = await existingUserByUUID(userUUID);
        if (!user) {
            return res.status(404).json({ message: 'کاربر یافت نشد.' });
        }
        const cart = await getOrCreateCart(user.userId);
        // Checking the existence of a course by courseUUID
        const course = await existingCourseByUUID(courseUUID);
        if (!course) {
            return res.status(404).json({ message: 'دوره پیدا نشد' });
        };

        //Check if the course has already been purchased
        const enrollment = await existingEnrolment(course.courseId, user.userId);
        if (enrollment) {
            return res.status(409).json({
                success: false,
                message: 'شما قبلا در دوره ثبت نام کرده اید'
            })
        };

        // Checking the existence of the course in the shopping cart
        const itemExist = await getCartItem(cart.cartId, course.courseId);
        if (itemExist) {
            return res.status(409).json({ message: 'دروه در سبد خرید موجود است' })
        }

        if (course.price === 0) {
            const ref_id = `free_${user.userId}_${course.courseId}_${Date.now()}`
            await createdEnrollment(user.userId, course.courseId, ref_id);
            return res.status(201).json({ message: 'ثبت نام شما در دوره با موفقیت انجام شد' })
        }

        await createCartItem(cart.cartId, course.courseId);
        return res.status(200).json({ message: 'دوره با موفقیت به سبد خرید اضافه شد' });

    } catch (error) {
        res.status(500).json({ message: 'خطا در اضافه کردن دوره به سبد خرید', error: error.message })
    }
}
// Remove course from cart
const removeCourseFromCart = async (req, res) => {
    try {
        const userUUID = req.user?.userId;
        const { courseUUID } = req.params;
        // Checking the existence of the user
        const user = await existingUserByUUID(userUUID);
        if (!user) {
            return res.status(404).json({ message: 'کاربر یافت نشد.' });
        }
        const cart = await getOrCreateCart(user.userId);
        if (!cart) {
            return res.status(404).json({ message: 'سبد خرید خالی است' })
        }
        // Checking the existence of a course by courseUUID
        const course = await existingCourseByUUID(courseUUID);
        if (!course) {
            return res.status(404).json({ message: 'دوره پیدا نشد' });
        }
        const cartItem = await getCartItem(course.courseId, cart.cartId);
        if (!cartItem) {
            return res.status(400).json({ message: 'این دوره در سبد خرید شما وجود ندارد.' });
        }

        await cartItem.destroy();
        res.status(200).json({ message: 'دوره با موفقیت از سبد خرید حذف شد' });

    } catch (error) {
        res.status(500).json({ message: 'خطا در حذف کردن دوره از سبد خرید', error: error.message })
    }
};
// Get courses available in the shopping cart
const getCartCourses = async (req, res) => {
    try {
        const userUUID = req.user?.userId;
        // Checking the existence of the user
        const user = await existingUserByUUID(userUUID);
        if (!user) {
            return res.status(404).json({ message: 'کاربر یافت نشد.' });
        }
        const cart = await getOrCreateCart(user.userId);
        if (!cart) {
            return res.status(404).json({ message: 'سبد خرید خالی است' })
        }
        const cartItems = await getCartItemsByCartId(cart.cartId);
        // Calculate the total price of the shopping cart
        const totalPrice = calculateTotalPrice(cartItems);

        return res.status(200).json({ message: 'سبد خرید با موفقیت دریافت شد', courses: cartItems, totalPrice: totalPrice })

    } catch (error) {
        res.status(500).json({ message: 'خطا در دریافت دوره های سبد خرید', error: error.message })
    }
};

module.exports = {
    addCourseToCart,
    removeCourseFromCart,
    getCartCourses,
}