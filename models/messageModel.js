import mysql from "mysql2";
// const userModel = new mysql.Schema({}) // mysql không dùng schema

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Conversation from "./ConversationModel.js";

const Message = sequelize.define('Message', {
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Conversation,
            key: 'id'
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'messages',
    timestamps: false // tắt createdAt, updatedAt mặc định
});

export default Message;
