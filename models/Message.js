// // backend/models/Message.js
// import mongoose from "mongoose";

// const MessageSchema = new mongoose.Schema(
//   {
//     room: { type: String, required: true },
//     user: { type: String, required: true },
//     userId: { type: String },
//     message: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Message", MessageSchema);
//UPDATED JS MODEL
// backend/models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true },
    user: { type: String, required: true },
    userId: { type: String },
    message: { type: String }, // Now optional (not required if file exists)
    
    // 🔥 NEW: File fields
    fileUrl: { type: String }, // Cloudinary URL
    fileName: { type: String }, // Original file name
    fileType: { type: String }, // image, pdf, document
    fileSize: { type: Number }, // Size in bytes
    
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);