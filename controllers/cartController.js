const { existingUserByUUID } = require('../services/authService');
const { existingCourseByUUID } = require('../services/courseService');
const { createCartItem, getCartItem, getCartItemsByCartId, getCart, createdCart } = require('../services/cartService');
const { calculateTotalPrice } = require('../utilities/totalPriceService');
const { createdEnrollment, existingEnrolment } = require('../services/paymentService');
const { StudentClass, Class } = require('../models');

// Add course to cart
const addCourseToCart = async (req, res) => {
    try {
        const userUUID = req.user?.userId;
        const { courseUUID } = req.params;

        if (req.user.role === 'teacher') {
            return res.status(403).json({ success: false, message: 'اساتید توانایی خرید دوره را ندارند , لطفا با یک اکانت معمولی مجددا تلاش بفرمایید' })
        };
        // Checking the existence of the user
        const user = await existingUserByUUID(userUUID);
        if (!user) {
            return res.status(404).json({ success: false, message: 'کاربر یافت نشد.' });
        }
        let cart;
        cart = await getCart(user.userId);
        if (!cart) {
            cart = await createdCart(user.userId);
        }
        // Checking the existence of a course by courseUUID
        const course = await existingCourseByUUID(courseUUID);
        if (!course) {
            return res.status(404).json({ success: false, message: 'دوره پیدا نشد' });
        };
        //Check if the course has already been purchased
        const enrollment = await existingEnrolment(course.courseId, user.userId);
        if (enrollment) {
            return res.status(409).json({
                success: false,
                message: 'شما قبلا در دوره ثبت نام کرده اید'
            })
        };

        //***************
        const classData = await Class.findOne({
            where: { courseId: course.courseId },
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
        //****************
        
        // Checking the existence of the course in the shopping cart
        const itemExist = await getCartItem(cart.cartId, course.courseId);
        if (itemExist) {
            return res.status(409).json({ success: false, message: 'دروه در سبد خرید موجود است' })
        }

        if (course.price === 0) {
            const ref_id = `free_${user.userId}_${course.courseId}_${Date.now()}`
            await createdEnrollment(user.userId, course.courseId, ref_id);
            return res.status(201).json({ message: 'ثبت نام شما در دوره با موفقیت انجام شد' })
        }

        await createCartItem(cart.cartId, course.courseId);
        return res.status(200).json({ success: true, message: 'دوره با موفقیت به سبد خرید اضافه شد' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'خطا در اضافه کردن دوره به سبد خرید', error: error.message })
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
            return res.status(404).json({ success: false, message: 'کاربر یافت نشد.' });
        }
        let cart;
        cart = await getCart(user.userId);
        if (!cart) {
            cart = await createdCart(user.userId);
            return res.status(404).json({ success: false, message: 'سبد خرید خالی است' })
        }

        // Checking the existence of a course by courseUUID
        const course = await existingCourseByUUID(courseUUID);
        if (!course) {
            return res.status(404).json({ success: false, message: 'دوره پیدا نشد' });
        }
        console.log(course.courseId, cart.cartId);

        const cartItem = await getCartItem(course.courseId, cart.cartId);
        if (!cartItem) {
            return res.status(400).json({ success: false, message: 'این دوره در سبد خرید شما وجود ندارد.' });
        }

        await cartItem.destroy();
        res.status(200).json({ success: true, message: 'دوره با موفقیت از سبد خرید حذف شد' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'خطا در حذف کردن دوره از سبد خرید', error: error.message })
    }
};
// Get courses available in the shopping cart
const getCartCourses = async (req, res) => {
    try {
        const userUUID = req.user?.userId;
        // Checking the existence of the user
        const user = await existingUserByUUID(userUUID);
        if (!user) {
            return res.status(404).json({ success: false, message: 'کاربر یافت نشد.' });
        }
        let cart;
        cart = await getCart(user.userId);
        if (!cart) {
            cart = await createdCart(user.userId);
            return res.status(404).json({ success: false, message: 'سبد خرید خالی است' })
        }
        const cartItems = await getCartItemsByCartId(cart.cartId);
        // Calculate the total price of the shopping cart
        const totalPrice = await calculateTotalPrice(cartItems);

        return res.status(200).json({ success: true, message: 'سبد خرید با موفقیت دریافت شد', courses: cartItems, totalPrice: totalPrice })

    } catch (error) {
        res.status(500).json({ success: false, message: 'خطا در دریافت دوره های سبد خرید', error: error.message })
    }
};

module.exports = {
    addCourseToCart,
    removeCourseFromCart,
    getCartCourses,
}