const http = require('http');
const express = require('express');
const { Server } = require('socket.io')
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config()
const db = require('./models');
const socketIndex = require('./socket');
const errorHandler = require('./utilities/errorHandler');
// const {socketAuthMiddleware} = require('./middlewares/authMiddleware')
// const {videoRoom} = require('./socket/videoRoom');


// Importing routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const classRoomRoutes = require('./routes/classRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const episodeRoutes = require('./routes/episodeRoutes');
const classRoutes = require('./routes/classRoutes');
const cartRoutes = require('./routes/cartRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const teacherPaymentRoutes = require('./routes/teacherPaymentRoutes');
const emailRoutes = require('./routes/emailRoutes');


const app = express();
const PORT = process.env.APP_PORT || 3000;

//server for express
const server = http.createServer(app)
// server for socket
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize socket logic
socketIndex(io);
// require('./socket')(io);
// io.use(socketAuthMiddleware);
// videoRoom(io)


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 دقیقه
  max: 85, // حداکثر 85 درخواست در دقیقه
  message: "لطفاً کمی صبر کنید، درخواست‌های زیادی ارسال شده است.",
  headers: true
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
})

// static path
const coursePreviewPath = path.join('storage', 'courses', 'coursePreviews');
const episodePath = path.join('storage', 'courses', 'episodes');
const paymentsProofPath = path.join('storage', 'teachers', 'paymentsProof');
const profilePath = path.join('storage', 'teachers', 'profiles')
const teachingPreviewPath = path.join('storage', 'teachers', 'teachingPreviews')

app.use('/coursePreview', express.static(coursePreviewPath))
app.use('/episode', express.static(episodePath))
app.use('/payments', express.static(paymentsProofPath))
app.use('/profile', express.static(profilePath))
app.use('/teachingPreview', express.static(teachingPreviewPath))

// Routes
app.use('/api/', limiter);
app.use('/api/home', (req, res) => {
  return res.status(200).json({ success: true, message: 'hallo' })
})
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/class', classRoomRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/class', classRoutes)
app.use('/api/carts', cartRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payments/teacher', teacherPaymentRoutes);
app.use('/api/email', emailRoutes);


// Handling errors
app.use(errorHandler);

// Connecting to the database and starting the server
db.sequelize
  .sync()
  .then(() => {
    console.log('Database connected successfully');
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

module.exports = { io };