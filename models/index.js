const sequelize = require('../config/database');

// Import models
const User = require('./User');
const Teacher = require('./Teacher');
const Course = require('./Course');
const Chapter = require('./Chapter');
const Episode = require('./Episode');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Ticket = require('./Ticket');
const TeacherPaymentMain = require('./TeacherPayment_Main');
const TeacherPaymentItem = require('./TeacherPayment_Items');
const Enrollment = require('./Enrollment');
const Email = require('./Email');
const Transaction = require('./Transaction');


// Definition of connections

// Teacher and Course
Teacher.hasMany(Course, { foreignKey: 'teacherId', onDelete: 'CASCADE' });
Course.belongsTo(Teacher, { foreignKey: 'teacherId' });

// Teacher and Chapter
Teacher.hasMany(Chapter, { foreignKey: 'teacherId', onDelete: 'CASCADE' });
Chapter.belongsTo(Teacher, { foreignKey: 'teacherId' });

// Teacher and Episode
Teacher.hasMany(Episode, { foreignKey: 'teacherId', onDelete: 'CASCADE' });
Episode.belongsTo(Teacher, { foreignKey: 'teacherId' });

// Course and Chapter
Course.hasMany(Chapter, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Chapter.belongsTo(Course, { foreignKey: 'courseId' });

// Chapter and Episode
Chapter.hasMany(Episode, { foreignKey: 'chapterId', onDelete: 'CASCADE' });
Episode.belongsTo(Chapter, { foreignKey: 'chapterId' });

// Cart and User
User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// Cart and CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

// Course and CartItem
Course.hasMany(CartItem, { foreignKey: 'courseId', onDelete: 'CASCADE' });
CartItem.belongsTo(Course, { foreignKey: 'courseId' });

// Many-to-Many relationship between Cart and Course
Cart.belongsToMany(Course, { through: CartItem, foreignKey: 'cartId', otherKey: 'courseId'});
Course.belongsToMany(Cart, { through: CartItem, foreignKey: 'courseId', otherKey: 'cartId' });

// Ticket and User
User.hasMany(Ticket, { foreignKey: 'userId', onDelete: 'CASCADE' });
Ticket.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

// TeacherPaymentMain and TeacherPaymentItem
TeacherPaymentMain.hasMany(TeacherPaymentItem, {foreignKey: 'paymentId'});
TeacherPaymentItem.belongsTo(TeacherPaymentMain, {foreignKey: 'paymentId'});

// TeacherPaymentMain and Teacher
TeacherPaymentMain.belongsTo(Teacher, {foreignKey: 'teacherId'});

// TeacherPaymentItem and Course
TeacherPaymentItem.belongsTo(Course, {foreignKey: 'courseId'});

// Enrollment and Course
Enrollment.belongsTo(Course, {foreignKey: 'courseId'});
Course.hasMany(Enrollment, {foreignKey: 'courseId'});

// Enrollment and User
Enrollment.belongsTo(User, {foreignKey: 'userId'});
User.hasMany(Enrollment, {foreignKey: 'userId'});



module.exports = {
  sequelize,
  User,
  Teacher,
  Course,
  Chapter,
  Episode,
  Cart,
  CartItem,
  Ticket,
  TeacherPaymentMain,
  TeacherPaymentItem,
  Enrollment,
  Email,
  Transaction,
};