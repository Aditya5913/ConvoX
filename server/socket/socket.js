const http = require("http");
const express = require("express");
const app = express();
const { Server } = require("socket.io");

const server = http.createServer(app);

/*
  ✅ Socket.IO setup for production
*/
const io = new Server(server, {
  cors: {
    origin: "*", // later you can restrict to Vercel URL
    methods: ["GET", "POST"],
  },
});

/*
  ✅ Online users map
*/
const allOnlineUsers = new Map();

/*
  Helper: get receiver socket id
*/
function getReciverSocketId(receiverUserId) {
  return allOnlineUsers.get(receiverUserId);
}

/*
  Socket connection
*/
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    allOnlineUsers.set(userId, socket.id);
  }

  // Send online users list
  io.emit("send-all-online-users", Array.from(allOnlineUsers.keys()));

  /*
    Disconnect
  */
  socket.on("disconnect", () => {
    if (userId) {
      allOnlineUsers.delete(userId);
    }

    io.emit("send-all-online-users", Array.from(allOnlineUsers.keys()));
  });
});

module.exports = { app, server, io, getReciverSocketId };
const http = require("http");
const express = require("express");
const app = express();
const { Server } = require("socket.io");

const server = http.createServer(app);

/*
  ✅ SOCKET.IO SETUP (PRODUCTION SAFE)
*/
const io = new Server(server, {
  cors: {
    origin: "https://convo-x-sigma.vercel.app", // 🔥 IMPORTANT (frontend URL)
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/*
  ✅ ONLINE USERS MAP
*/
const allOnlineUsers = new Map();

/*
  Helper function
*/
function getReciverSocketId(receiverUserId) {
  return allOnlineUsers.get(receiverUserId);
}

/*
  SOCKET CONNECTION
*/
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    allOnlineUsers.set(userId, socket.id);
  }

  io.emit("send-all-online-users", Array.from(allOnlineUsers.keys()));

  socket.on("disconnect", () => {
    if (userId) {
      allOnlineUsers.delete(userId);
    }

    io.emit("send-all-online-users", Array.from(allOnlineUsers.keys()));
  });
});

module.exports = { app, server, io, getReciverSocketId };
