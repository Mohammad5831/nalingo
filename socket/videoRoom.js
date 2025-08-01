const jwt = require('jsonwebtoken');
const { existingUserByUUID, existingTeacherByUUID } = require('../services/authService');
const { findClassSessionByRoomId, createdClassParticipant, updatedClassParticipant } = require('../services/classService');

const videoRoom = (io) => {
    const onlineUsers = {};

    io.use((socket, next) => {
        try{
            const token = socket.handshake.auth.token;
            if(!token) {
                return next(new Error('توکن ارائه نشده است'));
            }
            const payload= jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (err) {
            next(new Error('توکن نامعتبر است'));
        }
    })

    io.on('connection', (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}`);

        socket.on('join-room', async ({ roomId, userUUID, role }) => {
            try {
                // بررسی ورودی‌ها
                if (!roomId || !userUUID || !role) {
                    socket.emit('error', 'اطلاعات ناقص برای اتصال به کلاس');
                    return;
                }

                let userId;
                let fullName;
                if (role === 'student') {
                    const user = await existingUserByUUID(userUUID);
                    if (!user) {
                        socket.emit('error', 'دانش‌آموز یافت نشد');
                        return;
                    }
                    userId = user.userId;
                    fullName = `${user.firstName} ${user.lastName}`;
                } else if (role === 'teacher') {
                    const teacher = await existingTeacherByUUID(userUUID);
                    if (!teacher) {
                        socket.emit('error', 'معلم یافت نشد');
                        return;
                    }
                    userId = teacher.teacherId;
                    fullName = teacher.teacherName;
                } else {
                    socket.emit('error', 'نقش نامعتبر');
                    return;
                }

                const session = await findClassSessionByRoomId(roomId);
                if (!session) {
                    socket.emit('room not active');
                    return;
                }

                // جلوگیری از ورود تکراری با همان socketId
                if (onlineUsers[socket.id]) {
                    socket.emit('error', 'شما قبلاً به این کلاس متصل شده‌اید');
                    return;
                }

                // ذخیره در حافظه
                onlineUsers[socket.id] = {
                    socketId: socket.id,
                    userUUID,
                    userId,
                    role,
                    roomId,
                    CSId: session.CSId,
                    joinedAt: new Date(),
                    fullName,
                };

                socket.join(roomId);

                // ثبت حضور در دیتابیس
                try {
                    await createdClassParticipant(session.CSId, userId, fullName, role);
                } catch (dbError) {
                    console.error('❌ خطا در ثبت حضور در دیتابیس:', dbError.message);
                    socket.emit('error', 'خطا در ثبت حضور در کلاس');
                }

                console.log(`✅ ${fullName} joined room ${roomId}`);

                // اطلاع به دیگران
                socket.to(roomId).emit('user joined', {
                    socketId: socket.id,
                    name: fullName,
                    role,
                });

                // ارسال لیست کاربران به کاربر جدید
                const usersInRoom = Object.values(onlineUsers)
                    .filter(u => u.roomId === roomId && u.socketId !== socket.id)
                    .map(u => ({
                        socketId: u.socketId,
                        name: u.fullName,
                        role: u.role,
                    }));
                socket.emit('all users', usersInRoom);

            } catch (error) {
                console.error('❌ join-room error:', error.message);
                socket.emit('error', 'خطایی در ورود به کلاس رخ داد');
            }
        });

        // WebRTC signaling
        socket.on('sending signal', ({ targetSocketId, signal, callerInfo }) => {
            if (!targetSocketId || !signal || !callerInfo) {
                socket.emit('error', 'داده ناقص برای ارسال سیگنال');
                return;
            }io.to(targetSocketId).emit('user calling', {
                signal,
                fromSocketId: socket.id,
                callerInfo,
            });
        });

        socket.on('returning signal', ({ targetSocketId, signal }) => {
            if (!targetSocketId || !signal) {
                socket.emit('error', 'داده ناقص برای بازگشت سیگنال');
                return;
            }

            io.to(targetSocketId).emit('receiving returned signal', {
                signal,
                fromSocketId: socket.id,
            });
        });

        socket.on('ice-candidate', ({ targetSocketId, candidate }) => {
            if (!targetSocketId || !candidate) {
                socket.emit('error', 'ICE Candidate ناقص');
                return;
            }

            io.to(targetSocketId).emit('ice-candidate', {
                candidate,
                fromSocketId: socket.id,
            });
        });

        socket.on('disconnect', async () => {
            const user = onlineUsers[socket.id];
            if (!user) return;

            const leftAt = new Date();
            const duration = Math.floor((leftAt - user.joinedAt) / 1000);

            try {
                await updatedClassParticipant(leftAt, duration, user.CSId, user.userId, user.role);

                // اطلاع به سایر کاربران در کلاس
                socket.to(user.roomId).emit('user disconnected', {
                    socketId: socket.id,
                    name: user.fullName,
                    role: user.role,
                    duration,
                });

                console.log(`🚪 ${user.fullName} disconnected from ${user.roomId} after ${duration}s`);
                delete onlineUsers[socket.id];

            } catch (error) {
                console.error('❌ disconnect error:', error.message);
            }
        });
    });
};

module.exports = { videoRoom };

// const videoRoom = (io) => {
//   const rooms = {}; // memory storage فقط برای تماس‌ها

//   io.on('connection', (socket) => {
//     socket.on('join-room', ({ roomId }) => {
//       socket.join(roomId);
//       if (!rooms[roomId]) rooms[roomId] = [];
//       rooms[roomId].push(socket.id);

//       // اطلاع به سایرین
//       socket.to(roomId).emit('user-joined', socket.id);

//       // سیگنالینگ WebRTC
//       socket.on('signal', ({ targetId, signal }) => {
//         io.to(targetId).emit('signal', { senderId: socket.id, signal });
//       });

//       socket.on('disconnect', () => {
//         rooms[roomId] = rooms[roomId]?.filter(id => id !== socket.id);
//         socket.to(roomId).emit('user-left', socket.id);
//       });
//     });
//   });
// };

// module.exports = { videoRoom };
