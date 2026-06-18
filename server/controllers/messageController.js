const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const User = require("../models/user");
const { getReciverSocketId, io } = require("../socket/socket");

// Create Message
exports.CreateNewMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.userId;

    if (!receiverId || !message || !senderId) {
      return res.status(400).json({
        success: false,
        message: "Something Went wrong during fetching data",
      });
    }

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // Emit via Socket.IO
    const receiverSocketId = getReciverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-message", newMessage);
    }

    return res.status(200).json({
      success: true,
      message: "Message Sent Successfully",
      newMessage: newMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get All Messages Between Both Users
exports.getAllMessages = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const chatUserId = req.params.chatUserId;

    if (!chatUserId || !currentUserId) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong during fetching user Ids",
      });
    }

    const chatUserDetails = await User.findById(chatUserId);
    if (!chatUserDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const allMessages = await Conversation.findOne({
      members: { $all: [currentUserId, chatUserId] },
    })
      .populate("messages")
      .populate("members", "-password")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Successfully fetched all messages",
      allMessages: allMessages,
    });
  } catch (error) {
    // ✅ Fixed: error handling is now INSIDE the catch block
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
