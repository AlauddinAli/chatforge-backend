# ⚡ ChatForge Backend

<div align="center">

[![Live API](https://img.shields.io/badge/🚀_LIVE-API-green?style=for-the-badge)](https://chatforge-backend.onrender.com)
[![Frontend](https://img.shields.io/badge/💻_FRONTEND-Demo-blue?style=for-the-badge)](https://chatforge-frontend-fxkd.vercel.app)
[![Version](https://img.shields.io/badge/v2.0-Production-orange?style=for-the-badge)](https://github.com/AlauddinAli/chatforge-backend)

**Production-grade real-time messaging API powering ChatForge**

*WebSocket • Authentication • File Upload • Message Reactions • Threaded Replies*

</div>

---

## 🎯 Core Features

🔐 **JWT Authentication** • Register/Login with secure tokens  
⚡ **Real-time Socket.IO** • WebSocket messaging with instant delivery  
❤️ **Message Reactions** • Emoji reactions on any message  
💬 **Threaded Replies** • Conversation threading system  
📁 **File Uploads** • Images, PDFs, docs via Cloudinary CDN  
🏠 **Multi-room Chat** • Independent rooms with state management  
👥 **User Presence** • Live online/offline tracking  
⌨️ **Typing Indicators** • Real-time typing broadcasts  
✏️ **Message Actions** • Edit, delete, infinite scroll  

---

## ⚙️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Node.js • Express • Socket.IO |
| **Database** | MongoDB Atlas • Mongoose ODM |
| **Security** | JWT • Bcrypt • CORS |
| **Cloud** | Cloudinary CDN • Render |

---

## 🚀 Quick Start

### 1. Install
git clone https://github.com/AlauddinAli/chatforge-backend.git
cd chatforge-backend
npm install

### 2. Configure `.env`
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/chatforge
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

### 3. Run
npm run dev # Development with auto-reload
npm start # Production

Server at 👉 [**http://localhost:5000**](http://localhost:5000) 🚀

---

## 📡 API Reference

### Authentication
POST /api/auth/register # Create account
POST /api/auth/login # Sign in
PUT /api/users/profile # Update profile

### Files & Messages
POST /api/upload # Upload file (max 10MB)
GET /api/messages/:room # Get message history
GET /health # Server status

### Socket.IO Events
// Client → Server
joinRoom, sendMessage, sendReply, addReaction,
editMessage, deleteMessage, typing, updateUsername

// Server → Client
receiveMessage, messageReaction, messageEdited,
messageDeleted, onlineUsers, typing

---

## 🗂️ Database Schema

**User:** `name, email, password (hashed)`  
**Message:** `room, user, message, fileUrl, reactions (Map), replyTo, edited, timestamps`

---

## 🔒 Security

✅ JWT tokens • Bcrypt hashing • CORS protection  
✅ Input validation • Environment secrets • HTTPS  

---

## 🏗️ Architecture

React Client (Vercel)
↓ WebSocket + HTTP
Express API + Socket.IO (Render)
↓
MongoDB Atlas + Cloudinary CDN

---

## 📦 Project Structure
chatforge-backend/
├── models/ # User & Message schemas
├── routes/ # Auth & upload endpoints
├── middleware/ # JWT verification
├── db.js # MongoDB connection
└── index.js # Main server + Socket.IO

---

## 🚀 Deployment (Render)

1. Push to GitHub
2. Create Web Service on Render
3. Add environment variables
4. Deploy! Auto-deploy on push enabled

**MongoDB:** Free tier at mongodb.com/cloud/atlas  
**Cloudinary:** Free tier at cloudinary.com

---

## 👨‍💻 Built By

**Alauddin Ali** 

[![GitHub](https://img.shields.io/badge/GitHub-AlauddinAli-black?style=flat-square&logo=github)](https://github.com/AlauddinAli)


**Related:** [Frontend Repo](https://github.com/AlauddinAli/chatforge-frontend)

---

<div align="center">

**Built with ❤️  • October 2025**

⭐ Star this repo if you like it!

*"Scalable backends. Clean code. Always shipping."* 🚀

</div>





