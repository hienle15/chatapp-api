import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import UserModel from "./models/userModel.js";
import sequelize from './config/database.js';
import UserRouter from "./routes/userRouter.js";
import MessageRouter from "./routes/messageRoute.js";
import Conversation from "./models/ConversationModel.js";
import Message from "./models/messageModel.js";
import User from "./models/userModel.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger.js";
import cors from "cors";

// Nhập máy chủ và io từ socket.js
import { app, io, server } from "./socket/socket.js";

dotenv.config({});

// const app = express()// XÓA DÒNG NÀY - đã được nhập từ socket.js

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

//middware (áp dụng cho 'app' đã nhập)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOption = {
    origin: '*', // CHO PHÉP TẤT CẢ NGUỒN GỐC (chỉ dùng khi phát triển)
    credentials: true
};
app.use(cors({
    origin: "https://chatapp-production-da0e.up.railway.app",
    credentials: true
}));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cookieParser());

// Routers
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/message", MessageRouter);

// 1 conversation có nhiều message
Conversation.hasMany(Message, { foreignKey: 'conversationId' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

// Mối quan hệ với User (tùy nhu cầu em có thể thêm)
User.hasMany(Message, { foreignKey: 'senderId' });
User.hasMany(Message, { foreignKey: 'receiverId' });

// Đồng bộ hóa database và khởi động máy chủ (sử dụng 'server' từ socket.js để lắng nghe)
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created!');
        server.listen(PORT, HOST, () => {
            console.log(`Server listening at http://${HOST}:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });