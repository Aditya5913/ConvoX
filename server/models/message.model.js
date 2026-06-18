const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ✅ Fixed: was 'require'
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ✅ Fixed: was 'require'
    },
    message: {
      type: String,
      required: true, // ✅ Fixed: was 'require'
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
