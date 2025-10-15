


// backend/index.js
// import dotenv from "dotenv";
// dotenv.config();

// console.log("✅ .env loaded at server start");
// console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Missing");
// console.log("CLOUDINARY_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing");

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

// // ✅ CORS Configuration
// app.use(cors({
//   origin: [
//     "https://chatforge-frontend-fxkd.vercel.app",
//     "http://localhost:5173",
//     "http://localhost:4173",
//     "http://localhost:5000"
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());
// app.use("/api/auth", authRoutes);
// app.use("/api/users", authRoutes);
// // Enable upload route only if Cloudinary is configured
// if (
//   process.env.CLOUDINARY_CLOUD_NAME &&
//   process.env.CLOUDINARY_API_KEY &&
//   process.env.CLOUDINARY_API_SECRET
// ) {
//   const { default: uploadRoute } = await import("./routes/upload.js");
//   app.use("/api/upload", uploadRoute);
//   console.log("✅ Upload route enabled (Cloudinary configured)");
// } else {
//   console.warn("⚠️ Cloudinary not configured; /api/upload disabled");
// }

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "https://chatforge-frontend-fxkd.vercel.app",
//       "http://localhost:5173",
//       "http://localhost:4173"
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

//   socket.on("sendMessage", async ({ room, message, user, userId, fileUrl, fileName, fileType, fileSize }) => {
//     try {
//       const saved = await Message.create({
//         room,
//         user,
//         userId: userId || null,
//         message: message || "",
//         fileUrl: fileUrl || null,
//         fileName: fileName || null,
//         fileType: fileType || null,
//         fileSize: fileSize || null,
//       });

//       const payload = {
//         _id: saved._id,
//         room: saved.room,
//         message: saved.message,
//         user: saved.user,
//         userId: saved.userId,
//         fileUrl: saved.fileUrl,
//         fileName: saved.fileName,
//         fileType: saved.fileType,
//         fileSize: saved.fileSize,
//         createdAt: saved.createdAt,
//       };

//       io.to(room).emit("receiveMessage", payload);
      
//       if (fileUrl) {
//         console.log(`📁 [${room}] ${user} sent file: ${fileName}`);
//       } else {
//         console.log(`💬 [${room}] ${user}: ${message}`);
//       }
//     } catch (err) {
//       console.error("sendMessage error:", err);
//     }
//   });

//   socket.on("deleteMessage", async ({ room, messageId }) => {
//     try {
//       await Message.findByIdAndDelete(messageId);
//       io.to(room).emit("messageDeleted", { messageId });
//       console.log(`🗑️ Message deleted: ${messageId}`);
//     } catch (err) {
//       console.error("deleteMessage error:", err);
//     }
//   });

//   socket.on("editMessage", async ({ room, messageId, newMessage }) => {
//     try {
//       await Message.findByIdAndUpdate(messageId, {
//         message: newMessage,
//         edited: true,
//       });
//       io.to(room).emit("messageEdited", { messageId, newMessage });
//       console.log(`✏️ Message edited: ${messageId}`);
//     } catch (err) {
//       console.error("editMessage error:", err);
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
//   res.send("🔥 ChatForge Backend Running with File Upload Support!");
// });

// app.get("/health", (req, res) => {
//   res.json({ status: "OK", timestamp: new Date() });
// });

// // 🔥 NEW: Load more messages route for infinite scroll
// app.get("/api/messages/:room", async (req, res) => {
//   try {
//     const { room } = req.params;
//     const { before, limit = 50 } = req.query;
    
//     let query = { room };
//     if (before) {
//       const beforeMsg = await Message.findById(before);
//       if (beforeMsg) {
//         query.createdAt = { $lt: beforeMsg.createdAt };
//       }
//     }
    
//     const messages = await Message.find(query)
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit));
    
//     res.json(messages.reverse());
//   } catch (err) {
//     console.error("Load messages error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () =>
//   console.log(`🚀 Server running on port ${PORT}`)
// );


// backend/index.js
import dotenv from "dotenv";
dotenv.config();

console.log("✅ .env loaded at server start");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Missing");
console.log("CLOUDINARY_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing");

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

// ✅ CORS Configuration
app.use(cors({
  origin: [
    "https://chatforge-frontend-fxkd.vercel.app",
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:5000"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", authRoutes);

// Enable upload route only if Cloudinary is configured
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  const { default: uploadRoute } = await import("./routes/upload.js");
  app.use("/api/upload", uploadRoute);
  console.log("✅ Upload route enabled (Cloudinary configured)");
} else {
  console.warn("⚠️ Cloudinary not configured; /api/upload disabled");
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://chatforge-frontend-fxkd.vercel.app",
      "http://localhost:5173",
      "http://localhost:4173"
    ],
    credentials: true
  }
});

// --- 🔥 FIXED: Track state using userId as unique identifier ---
const socketRooms = {}; // { socketId: Set([rooms]) }
const userSocketMap = {}; // { userId: socketId }
const onlineUsersByRoom = {}; // { room: Map({ userId: username }) }

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  socket.on("joinRoom", async ({ room, user, userId }) => {
    try {
      // Store user data on socket
      socket.data.userName = user;
      socket.data.userId = userId;

      // 🔥 FIX: Remove user from previous rooms
      const prevRooms = socketRooms[socket.id] || new Set();
      for (const r of prevRooms) {
        socket.leave(r);
        if (onlineUsersByRoom[r] && userId) {
          onlineUsersByRoom[r].delete(userId);
          // Emit updated list without duplicates
          io.to(r).emit("onlineUsers", Array.from(onlineUsersByRoom[r].values()));
        }
      }

      // 🔥 FIX: Track user by userId instead of username
      if (userId) {
        // Disconnect old socket if user reconnects
        const oldSocketId = userSocketMap[userId];
        if (oldSocketId && oldSocketId !== socket.id) {
          const oldSocket = io.sockets.sockets.get(oldSocketId);
          if (oldSocket) {
            oldSocket.disconnect(true);
          }
        }
        userSocketMap[userId] = socket.id;
      }

      socket.join(room);
      socketRooms[socket.id] = new Set([room]);

      // 🔥 FIX: Use Map with userId as key to prevent duplicates
      if (!onlineUsersByRoom[room]) {
        onlineUsersByRoom[room] = new Map();
      }
      
      if (userId) {
        onlineUsersByRoom[room].set(userId, user); // userId -> username mapping
      } else {
        // Fallback for users without userId (shouldn't happen)
        onlineUsersByRoom[room].set(socket.id, user);
      }

      // Emit unique usernames only
      io.to(room).emit("onlineUsers", Array.from(onlineUsersByRoom[room].values()));

      // Load previous messages
      const msgs = await Message.find({ room })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      socket.emit("roomMessages", msgs.reverse());

      console.log(`👤 ${user} (${userId}) joined room: ${room}`);
    } catch (err) {
      console.error("joinRoom error:", err);
    }
  });

  // 🔥 NEW: Handle username updates
  socket.on("updateUsername", ({ room, userId, newUsername }) => {
    try {
      if (!userId || !room) return;

      // Update username in the room's user map
      if (onlineUsersByRoom[room] && onlineUsersByRoom[room].has(userId)) {
        onlineUsersByRoom[room].set(userId, newUsername);
        socket.data.userName = newUsername;
        
        // Broadcast updated user list
        io.to(room).emit("onlineUsers", Array.from(onlineUsersByRoom[room].values()));
        console.log(`✏️ ${userId} updated username to: ${newUsername} in ${room}`);
      }
    } catch (err) {
      console.error("updateUsername error:", err);
    }
  });

  socket.on("sendMessage", async ({ room, message, user, userId, fileUrl, fileName, fileType, fileSize }) => {
    try {
      const saved = await Message.create({
        room,
        user,
        userId: userId || null,
        message: message || "",
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileType: fileType || null,
        fileSize: fileSize || null,
      });

      const payload = {
        _id: saved._id,
        room: saved.room,
        message: saved.message,
        user: saved.user,
        userId: saved.userId,
        fileUrl: saved.fileUrl,
        fileName: saved.fileName,
        fileType: saved.fileType,
        fileSize: saved.fileSize,
        createdAt: saved.createdAt,
      };

      io.to(room).emit("receiveMessage", payload);
      
      if (fileUrl) {
        console.log(`📁 [${room}] ${user} sent file: ${fileName}`);
      } else {
        console.log(`💬 [${room}] ${user}: ${message}`);
      }
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  });

  socket.on("deleteMessage", async ({ room, messageId }) => {
    try {
      await Message.findByIdAndDelete(messageId);
      io.to(room).emit("messageDeleted", { messageId });
      console.log(`🗑️ Message deleted: ${messageId}`);
    } catch (err) {
      console.error("deleteMessage error:", err);
    }
  });

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

  socket.on("typing", ({ room, user }) => {
    if (!room || !user) return;
    socket.to(room).emit("typing", { user });
  });

  socket.on("disconnect", () => {
    const userName = socket.data?.userName;
    const userId = socket.data?.userId;
    const rooms = socketRooms[socket.id] || new Set();

    // 🔥 FIX: Remove by userId to prevent duplicate entries
    for (const r of rooms) {
      if (onlineUsersByRoom[r]) {
        if (userId) {
          onlineUsersByRoom[r].delete(userId);
        } else {
          onlineUsersByRoom[r].delete(socket.id);
        }
        io.to(r).emit("onlineUsers", Array.from(onlineUsersByRoom[r].values()));
      }
    }

    if (userId) {
      delete userSocketMap[userId];
    }
    delete socketRooms[socket.id];
    console.log(`❌ User disconnected: ${socket.id} (${userName})`);
  });
});

app.get("/", (req, res) => {
  res.send("🔥 ChatForge Backend Running with File Upload Support!");
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// 🔥 Load more messages route for infinite scroll
app.get("/api/messages/:room", async (req, res) => {
  try {
    const { room } = req.params;
    const { before, limit = 50 } = req.query;
    
    let query = { room };
    if (before) {
      const beforeMsg = await Message.findById(before);
      if (beforeMsg) {
        query.createdAt = { $lt: beforeMsg.createdAt };
      }
    }
    
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(messages.reverse());
  } catch (err) {
    console.error("Load messages error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
