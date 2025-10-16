// // backend/models/Message.js
// import mongoose from "mongoose";

// const MessageSchema = new mongoose.Schema(
//   {
//     room: { type: String, required: true },
//     user: { type: String, required: true },
//     userId: { type: String },
//     message: { type: String }, // Now optional (not required if file exists)
    
//     // 🔥 NEW: File fields
//     fileUrl: { type: String }, // Cloudinary URL
//     fileName: { type: String }, // Original file name
//     fileType: { type: String }, // image, pdf, document
//     fileSize: { type: Number }, // Size in bytes
    
//     edited: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Message", MessageSchema);



// backend/models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true },
    user: { type: String, required: true },
    userId: { type: String },
    message: { type: String }, // Optional if file exists
    
    // 🔥 File fields
    fileUrl: { type: String },
    fileName: { type: String },
    fileType: { type: String },
    fileSize: { type: Number },
    
    edited: { type: Boolean, default: false },
    
    // 🔥 NEW: Reactions feature (emoji → array of userIds)
    reactions: {
      type: Map,
      of: [String],
      default: {}
    },
    
    // 🔥 NEW: Threads/Replies feature
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null
    },
    replyCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
