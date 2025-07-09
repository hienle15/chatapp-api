import Conversation from "../models/ConversationModel.js";
import Message from "../models/messageModel.js";
import { Op } from "sequelize";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id; // lấy từ middleware xác thực
    const receiverId = parseInt(req.params.id);
    const { message } = req.body;

    // Tìm hoặc tạo cuộc hội thoại
    let gotConversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { participant1Id: senderId, participant2Id: receiverId },
          { participant1Id: receiverId, participant2Id: senderId }
        ]
      }
    });

    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participant1Id: senderId,
        participant2Id: receiverId
      });
    }

    // Tạo tin nhắn mới
    const newMessage = await Message.create({
      senderId,
      receiverId,
      conversationId: gotConversation.id,
      message
    });

    // Gửi tin nhắn realtime đến tất cả socket của người nhận
    const receiverSocketIds = getReceiverSocketId(receiverId);
    console.log("Server - Receiver Socket IDs:", receiverSocketIds); // THÊM DÒNG NÀY
    if (receiverSocketIds && receiverSocketIds.length > 0) {
      receiverSocketIds.forEach(socketId => {
        io.to(socketId).emit("newMessage", newMessage);
        console.log(`Server - Emitting newMessage to socketId: ${socketId}`); // THÊM DÒNG NÀY
      });
    }

    // (Tuỳ chọn) Gửi lại cho người gửi nếu cần
    const senderSocketIds = getReceiverSocketId(senderId);
    if (senderSocketIds && senderSocketIds.length > 0) {
      senderSocketIds.forEach(socketId => {
        io.to(socketId).emit("newMessage", newMessage);
      });
    }

    return res.status(201).json({ newMessage });

  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ message: "Failed to send message" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const receiverId = parseInt(req.params.id);
    const senderId = req.id;

    const conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { participant1Id: senderId, participant2Id: receiverId },
          { participant1Id: receiverId, participant2Id: senderId }
        ]
      },
      include: [{ model: Message }],
      order: [[Message, 'timestamp', 'ASC']]
    });

    if (!conversation) {
      return res.status(200).json([]); // Không có tin nhắn
    }

    return res.status(200).json(conversation.Messages);

  } catch (error) {
    console.error("Error in getMessage:", error);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};
