const express = require("express");
const router = express.Router();

const {
  CreateNewMessage,
  getAllMessages,
} = require("../controllers/messageController");
const { checkAuth } = require("../middlewares/auth");

router.post("/send-message", checkAuth, CreateNewMessage);
router.get("/get-all-messages/:chatUserId", checkAuth, getAllMessages);

module.exports = router;
