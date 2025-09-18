// backend/index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import Message from "./models/Message.js"; // ✅ MongoDB message model

// Connect MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// --- Track state ---
const socketRooms = {}; // socket.id -> Set of rooms joined
const onlineUsersByRoom = {}; // room -> Set of usernames

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // ✅ Join room
  socket.on("joinRoom", async ({ room, user, userId }) => {
    try {
      socket.data.userName = user;

      // Leave old rooms
      const prevRooms = socketRooms[socket.id] || new Set();
      for (const r of prevRooms) {
        socket.leave(r);
        if (onlineUsersByRoom[r]) {
          onlineUsersByRoom[r].delete(user);
          io.to(r).emit("onlineUsers", Array.from(onlineUsersByRoom[r]));
        }
      }

      // Join new room
      socket.join(room);
      socketRooms[socket.id] = new Set([room]);

      if (!onlineUsersByRoom[room]) onlineUsersByRoom[room] = new Set();
      onlineUsersByRoom[room].add(user);

      io.to(room).emit("onlineUsers", Array.from(onlineUsersByRoom[room]));

      // Send last 50 messages
      const msgs = await Message.find({ room })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      socket.emit("roomMessages", msgs.reverse());

      console.log(`👤 ${user} joined room: ${room}`);
    } catch (err) {
      console.error("joinRoom error:", err);
    }
  });

  // ✅ Send message
  socket.on("sendMessage", async ({ room, message, user, userId }) => {
    try {
      const saved = await Message.create({
        room,
        user,
        userId: userId || null,
        message,
      });

      const payload = {
        _id: saved._id,
        room: saved.room,
        message: saved.message,
        user: saved.user,
        userId: saved.userId,
        createdAt: saved.createdAt,
      };

      io.to(room).emit("receiveMessage", payload);
      console.log(`💬 [${room}] ${user}: ${message}`);
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  });

  // ✅ Typing indicator
  socket.on("typing", ({ room, user }) => {
    if (!room || !user) return;
    socket.to(room).emit("typing", { user });
  });

  // ✅ Disconnect
  socket.on("disconnect", () => {
    const userName = socket.data?.userName;
    const rooms = socketRooms[socket.id] || new Set();

    for (const r of rooms) {
      if (onlineUsersByRoom[r]) {
        if (userName) onlineUsersByRoom[r].delete(userName);
        io.to(r).emit("onlineUsers", Array.from(onlineUsersByRoom[r]));
      }
    }

    delete socketRooms[socket.id];
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.send("🔥 ChatForge Backend Running with Socket.IO + Persistence!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
