const { existingTeacherByUUID } = require('../services/authService');

const checkUserRole = async (user, allowedRoles) => {
    if (!user || !allowedRoles.includes(user.role)) {
        const error = new Error('دسترسی غیرمجاز: فقط نقش‌های مجاز اجازه این عملیات را دارند.');
        error.statusCode = 403;
        throw error;
    }
};

const checkCourseAccess = async (user, course) => {
    if (!user) {
        const error = new Error('کاربر احراز هویت نشده است.');
        error.statusCode = 401;
        throw error;
    }

    const teacher = await existingTeacherByUUID(user.userId);

    const isAdmin = user.role === 'admin';
    const isOwner = course.teacherId === teacher?.teacherId;

    if (!isAdmin && !isOwner) {
        const error = new Error('شما مجاز به انجام این عملیات نیستید.');
        error.statusCode = 403;
        throw error;
    }
};

const checkChapterAccess = async (user, chapter) => {
    if (!user) {
        const error = new Error('کاربر احراز هویت نشده است.');
        error.statusCode = 401;
        throw error;
    }

    const teacher = await existingTeacherByUUID(user.userId);

    const isAdmin = user.role === 'admin';
    const isOwner = chapter.teacherId === teacher?.teacherId;

    if (!isAdmin && !isOwner) {
        const error = new Error('شما مجاز به انجام این عملیات نیستید.');
        error.statusCode = 403;
        throw error;
    }
};

const checkEpisodeAccess = async (user, episode) => {
    if (!user) {
        const error = new Error('کاربر احراز هویت نشده است.');
        error.statusCode = 401;
        throw error;
    }

    const teacher = await existingTeacherByUUID(user.userId);

    const isAdmin = user.role === 'admin';
    const isOwner = episode.teacherId === teacher?.teacherId;

    if (!isAdmin && !isOwner) {
        const error = new Error('شما مجاز به انجام این عملیات نیستید.');
        error.statusCode = 403;
        throw error;
    }
};

module.exports = {
    checkUserRole,
    checkCourseAccess,
    checkChapterAccess,
    checkEpisodeAccess,
}