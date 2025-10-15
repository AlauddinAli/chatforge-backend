// // backend/routes/upload.js
// import express from "express";
// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// //
// console.log("🔍 Cloudinary Config Check:");
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");
//   //
// const router = express.Router();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure Multer Storage with Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     // Determine folder and resource type based on file type
//     let folder = "chatforge/others";
//     let resourceType = "auto";
    
//     if (file.mimetype.startsWith("image/")) {
//       folder = "chatforge/images";
//       resourceType = "image";
//     } else if (file.mimetype === "application/pdf") {
//       folder = "chatforge/documents";
//       resourceType = "raw";
//     } else {
//       folder = "chatforge/documents";
//       resourceType = "raw";
//     }

//     return {
//       folder: folder,
//       resource_type: resourceType,
//       allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "txt", "zip"],
//       max_file_size: 10 * 1024 * 1024, // 10MB
//     };
//   },
// });

// // File filter - validate file types
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "image/jpeg",
//     "image/jpg", 
//     "image/png",
//     "image/gif",
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     "text/plain",
//     "application/zip",
//   ];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. Only images, PDFs, and documents allowed."), false);
//   }
// };

// // Configure multer
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//   },
// });

// // Upload endpoint
// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Determine file type
//     let fileType = "document";
//     if (req.file.mimetype.startsWith("image/")) {
//       fileType = "image";
//     } else if (req.file.mimetype === "application/pdf") {
//       fileType = "pdf";
//     }

//     // Return file info
//     res.status(200).json({
//       message: "File uploaded successfully",
//       fileUrl: req.file.path, // Cloudinary URL
//       fileName: req.file.originalname,
//       fileType: fileType,
//       fileSize: req.file.size,
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ message: "Error uploading file", error: err.message });
//   }
// });
// export default router;

// // backend/routes/upload.js
// import express from "express";
// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import dotenv from "dotenv";

// dotenv.config(); // ✅ LOAD .env BEFORE using process.env

// console.log("🔍 Cloudinary Config Check:");
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");

// const router = express.Router();

// // ✅ Configure Cloudinary after dotenv is loaded
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ Configure Multer Storage
// // Allow ANY file type by using Cloudinary's resource_type "auto"
// // and not restricting allowed_formats.
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     // Put everything under a generic uploads folder; Cloudinary will set type automatically
//     const folder = "chatforge/uploads";
//     return {
//       folder,
//       resource_type: "auto",
//     };
//   },
// });

// // ✅ File Filter: accept ANY file type
// const fileFilter = (req, file, cb) => cb(null, true);

// // ✅ Configure Multer
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
// });

// // ✅ Upload Endpoint
// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     let fileType = "document";
//     if (req.file.mimetype.startsWith("image/")) fileType = "image";
//     else if (req.file.mimetype === "application/pdf") fileType = "pdf";

//     res.status(200).json({
//       message: "✅ File uploaded successfully",
//       fileUrl: req.file.path, // Cloudinary URL
//       fileName: req.file.originalname,
//       fileType,
//       fileSize: req.file.size,
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ message: "Error uploading file", error: err.message });
//   }
// });

// export default router;
// // src/components/ProtectedRoute.jsx
// backend/routes/upload.js
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

console.log("🔍 Cloudinary Config Check:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder and resource type based on file type
    let folder = "chatforge/uploads";
    let resourceType = "auto";

    return {
      folder: folder,
      resource_type: resourceType,
      allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "txt", "zip"],
    };
  },
});

// File filter - validate file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/zip",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, PDFs, and documents allowed."), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload endpoint
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Determine file type
    let fileType = "document";
    if (req.file.mimetype.startsWith("image/")) {
      fileType = "image";
    } else if (req.file.mimetype === "application/pdf") {
      fileType = "pdf";
    }

    // Return file info
    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: req.file.path, // Cloudinary URL
      fileName: req.file.originalname,
      fileType: fileType,
      fileSize: req.file.size,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error uploading file", error: err.message });
  }
});

export default router;