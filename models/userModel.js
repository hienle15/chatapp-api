import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// const userModel = new mysql.Schema({}) // mysql không dùng schema

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, // bắt buộc phải nhập
        unique: true       // không được trùng email
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING,
        defaultValue: ''
    }
},
    {
        tableName: 'users', // tên bảng
        timestamps: false   // nếu không dùng createdAt/updatedAt
    });

export default User;
