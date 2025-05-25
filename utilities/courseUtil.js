
const checkCourseLanguage = async (language) => {
    const allowedLanguage = ["english", "german", "spanish", "chinese", "french", "arabic", "russian", "hindi", "japanese", "portuguese"];

    if (!language || !allowedLanguage.includes(language)) {
        const error = new Error('زبان انتخابی نامعتبر است');
        error.statusCode = 400;
        throw error;

    }
};
const checkCourseLevel = async (level) => {
    const allowedLevel = ["a1", "a2", "b1", "b2", "c1", "c2"];

    if (!level || !allowedLevel.includes(level)) {
        const error = new Error('مهارت انتخابی نامعتبر است');
        error.statusCode = 400;
        throw error;
    }
};
const checkCourseSkillType = async (skillType) => {
    const allowedSkillType = ["fullSkill", "listening", "speaking", "reading", "writing", "grammar"];

    if (!skillType || !allowedSkillType.includes(skillType)) {
        const error = new Error('مهارت موردنظر یافت نشد');
        error.statusCode = 400;
        throw error;
    }
};

module.exports = {
    checkCourseLanguage,
    checkCourseLevel,
    checkCourseSkillType,
}