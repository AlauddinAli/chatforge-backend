# ⚡ ChatForge Backend  

A powerful **real-time chat backend** built with **Node.js, Express, MongoDB, and Socket.IO**.  
Handles authentication, message persistence, multi-room chat, and live user presence.  

---

## 🌍 Live Backend  
🔗 [ChatForge Backend API](https://chatforge-backend.onrender.com)  


## 🌍 Live Frontend  
🔗 [ChatForge Frontend ](https://chatforge-frontend-fxkd.vercel.app/)  

---
## Related Repositories

🖥️ Frontend → [ChatForge](https://github.com/AlauddinAli/chatforge-frontend)

⚡ Backend → (this repo)
## ✨ Features  

- **JWT Authentication** (Register/Login)  
- **Real-time WebSocket communication** with Socket.IO  
- **Multi-room support** (General, Coding, Random, etc.)  
- **Online users tracking** per room  
- **Typing indicators** (instant feedback while someone types)  
- **Message persistence** (stored in MongoDB Atlas)  
- **Production ready** (Render + MongoDB Atlas)  

---

## ⚙️ Tech Stack  

| Layer       | Technologies ⚡ |
|-------------|----------------|
| **Backend** | Node.js, Express |
| **Database** | MongoDB Atlas, Mongoose |
| **Real-Time** | Socket.IO |
| **Auth** | JWT, Bcrypt |
| **Deployment Backend** | Render |
| **Deployment Frontend** | Vercel |
---

## 🚀 Getting Started  

### 1️⃣ Clone the backend repo  
```bash
git clone https://github.com/YOUR-USERNAME/chatforge-backend
cd chatforge-backend
npm install
```
### 2️⃣ Evironment Variables

Create a .env file in the backend root with:

```
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```
### 3️⃣ Run Locally
```
npm run dev
```

### Backend runs at 👉 http://localhost:5000

### Author

Built with ❤️ by Alauddin Ali

💡Passionate about building scalable systems and writing clean, maintainable code.
Always learning. Always shipping. 🚀
