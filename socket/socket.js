import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Socket } from "dgram";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['*'],
        methods: ['GET', 'POST'],
          credentials: true // 
    },
});
const userSocketMap = {}; // userId => Set(socketIds)
export const getReceiverSocketId = (receiverId) => {
    const socketSet = userSocketMap[receiverId];
    if (!socketSet) return null;
    return Array.from(socketSet); // trả về mảng socketId
};
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (!userId) return;

    socket.userId = userId;

    // Nếu userId chưa có, tạo Set mới
    if (!userSocketMap[userId]) {
        userSocketMap[userId] = new Set();
    }

    userSocketMap[userId].add(socket.id);

    console.log('✅ user connected:', userId, 'socketId:', socket.id);

    // Emit danh sách user đang online
    io.emit('getOnLineUsers', Object.keys(userSocketMap).map(id => ({ _id: parseInt(id) })));

    socket.on('disconnect', () => {
        console.log('❌ user disconnected:', userId, 'socketId:', socket.id);

        const userSockets = userSocketMap[userId];
        if (userSockets) {
            userSockets.delete(socket.id); // Xoá socket hiện tại
            if (userSockets.size === 0) {
                delete userSocketMap[userId]; // Nếu hết socket thì xoá user luôn
            }
        }

        io.emit('getOnLineUsers', Object.keys(userSocketMap).map(id => ({ _id: parseInt(id) })));
    });
});
export { app, io, server }