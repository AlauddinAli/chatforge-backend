// backend/models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true },
    user: { type: String, required: true },
    userId: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
