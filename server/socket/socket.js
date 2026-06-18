const http = require("http");
const express = require("express");
const app = express();
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const allOnlineUsers = {};

function getReciverSocketId(receiverUserId) {
  return allOnlineUsers[receiverUserId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId !== undefined) {
    allOnlineUsers[userId] = socket.id;
  }

  io.emit("send-all-online-users", Object.keys(allOnlineUsers));

  socket.on("disconnect", () => {
    delete allOnlineUsers[userId];
    io.emit("send-all-online-users", Object.keys(allOnlineUsers));
  });
});

module.exports = { app, server, io, getReciverSocketId };
