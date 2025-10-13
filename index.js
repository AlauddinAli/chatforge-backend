// // backend/index.js
// import dotenv from "dotenv";
// dotenv.config();

// // ✅ Validate environment variables FIRST
// if (!process.env.MONGO_URI) {
//   console.error("❌ MONGO_URI is missing!");
//   process.exit(1);
// }
// if (!process.env.JWT_SECRET) {
//   console.error("❌ JWT_SECRET is missing!");
//   process.exit(1);
// }

// console.log("✅ Environment variables loaded");

// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import { connectDB } from "./db.js";
// import authRoutes from "./routes/auth.js";
// import Message from "./models/Message.js";

// // Connect MongoDB
// connectDB();

// const app = express();

// // ✅ FIXED CORS Configuration
// app.use(cors({
//   origin: [
//     "https://chatforge-frontend-fxkd.vercel.app",
//     "http://localhost:5173",
//     "http://localhost:5000"
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());
// app.use("/api/auth", authRoutes);

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "https://chatforge-frontend-fxkd.vercel.app",
//       "http://localhost:5173"
//     ],
//     credentials: true
//   }
// });

// // --- Track state ---
// const socketRooms = {};
// const onlineUsersByRoom = {};

// io.on("connection", (socket) => {
//   console.log(`⚡ User connected: ${socket.id}`);

//   socket.on("joinRoom", async ({ room, user, userId }) => {
//     try {
//       socket.data.userName = user;

//       const prevRooms = socketRooms[socket.id] || new Set();
//       for (const r of prevRooms) {
//         socket.leave(r);
//         if (onlineUsersByRoom[r]) {
//           onlineUsersByRoom[r].delete(user);
//           io.to(r).emit("onlineUsers", Array.from(onlineUsersByRoom[r]));
//         }
//       }

//       socket.join(room);
//       socketRooms[socket.id] = new Set([room]);

//       if (!onlineUsersByRoom[room]) onlineUsersByRoom[room] = new Set();
//       onlineUsersByRoom[room].add(user);

//       io.to(room).emit("onlineUsers", Array.from(onlineUsersByRoom[room]));

//       const msgs = await Message.find({ room })
//         .sort({ createdAt: -1 })
//         .limit(50)
//         .lean();
//       socket.emit("roomMessages", msgs.reverse());

//       console.log(`👤 ${user} joined room: ${room}`);
//     } catch (err) {
//       console.error("joinRoom error:", err);
//     }
//   });

//   socket.on("sendMessage", async ({ room, message, user, userId }) => {
//     try {
//       const saved = await Message.create({
//         room,
//         user,
//         userId: userId || null,
//         message,
//       });

//       const payload = {
//         _id: saved._id,
//         room: saved.room,
//         message: saved.message,
//         user: saved.user,
//         userId: saved.userId,
//         createdAt: saved.createdAt,
//       };

//       io.to(room).emit("receiveMessage", payload);
//       console.log(`💬 [${room}] ${user}: ${message}`);
//     } catch (err) {
//       console.error("sendMessage error:", err);
//     }
//   });

//   socket.on("typing", ({ room, user }) => {
//     if (!room || !user) return;
//     socket.to(room).emit("typing", { user });
//   });

//   socket.on("disconnect", () => {
//     const userName = socket.data?.userName;
//     const rooms = socketRooms[socket.id] || new Set();

//     for (const r of rooms) {
//       if (onlineUsersByRoom[r]) {
//         if (userName) onlineUsersByRoom[r].delete(userName);
//         io.to(r).emit("onlineUsers", Array.from(onlineUsersByRoom[r]));
//       }
//     }

//     delete socketRooms[socket.id];
//     console.log(`❌ User disconnected: ${socket.id}`);
//   });
// });

// app.get("/", (req, res) => {
//   res.send("🔥 ChatForge Backend Running!");
// });

// // ✅ Health check endpoint
// app.get("/health", (req, res) => {
//   res.json({ status: "OK", timestamp: new Date() });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () =>
//   console.log(`🚀 Server running on port ${PORT}`)
// );
//GLASSMORPHISM!!!!!!!!!!!!!!!!!
// backend/index.js
import dotenv from "dotenv";
dotenv.config();

// ✅ Validate environment variables FIRST
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing!");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing!");
  process.exit(1);
}

console.log("✅ Environment variables loaded");

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import Message from "./models/Message.js";

// Connect MongoDB
connectDB();

const app = express();

// ✅ FIXED CORS Configuration
app.use(cors({
  origin: [
    "https://chatforge-frontend-fxkd.vercel.app",
    "http://localhost:5173",
    "http://localhost:5000"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://chatforge-frontend-fxkd.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true
  }
});

// --- Track state ---
const socketRooms = {};
const onlineUsersByRoom = {};

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // ===== JOIN ROOM =====
  socket.on("joinRoom", async ({ room, user, userId }) => {
    try {
      socket.data.userName = user;

      const prevRooms = socketRooms[socket.id] || new Set();
      for (const r of prevRooms) {
        socket.leave(r);
        if (onlineUsersByRoom[r]) {
          onlineUsersByRoom[r].delete(user);
          io.to(r).emit("onlineUsers", Array.from(onlineUsersByRoom[r]));
        }
      }

      socket.join(room);
      socketRooms[socket.id] = new Set([room]);

      if (!onlineUsersByRoom[room]) onlineUsersByRoom[room] = new Set();
      onlineUsersByRoom[room].add(user);

      io.to(room).emit("onlineUsers", Array.from(onlineUsersByRoom[room]));

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

  // ===== SEND MESSAGE =====
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

  // ===== 🔥 DELETE MESSAGE =====
  socket.on("deleteMessage", async ({ room, messageId }) => {
    try {
      await Message.findByIdAndDelete(messageId);
      io.to(room).emit("messageDeleted", { messageId });
      console.log(`🗑️ Message deleted: ${messageId}`);
    } catch (err) {
      console.error("deleteMessage error:", err);
    }
  });

  // ===== 🔥 EDIT MESSAGE =====
  socket.on("editMessage", async ({ room, messageId, newMessage }) => {
    try {
      await Message.findByIdAndUpdate(messageId, {
        message: newMessage,
        edited: true,
      });
      io.to(room).emit("messageEdited", { messageId, newMessage });
      console.log(`✏️ Message edited: ${messageId}`);
    } catch (err) {
      console.error("editMessage error:", err);
    }
  });

  // ===== TYPING INDICATOR =====
  socket.on("typing", ({ room, user }) => {
    if (!room || !user) return;
    socket.to(room).emit("typing", { user });
  });

  // ===== DISCONNECT =====
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
  res.send("🔥 ChatForge Backend Running!");
});

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);