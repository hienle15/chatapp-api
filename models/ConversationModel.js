// models/conversationModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './userModel.js';

const Conversation = sequelize.define('Conversation', {
  participant1Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  participant2Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'conversations',
  timestamps: true // để có createdAt, updatedAt
});

export default Conversation;
