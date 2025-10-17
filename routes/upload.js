
// // backend/routes/upload.js
// import express from "express";
// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";

// console.log("🔍 Cloudinary Config Check:");
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");

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
//     let folder = "chatforge/uploads";
//     let resourceType = "auto";

//     return {
//       folder: folder,
//       resource_type: resourceType,
//       allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "txt", "zip"],
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

// 🔥 MIDDLEWARE TO CATCH MULTER ERRORS
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("=" . repeat(50));
    console.error("❌ MULTER ERROR:");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Field:", err.field);
    console.error("=" . repeat(50));
    return res.status(400).json({ 
      message: "File upload error", 
      error: err.message,
      code: err.code
    });
  } else if (err) {
    console.error("=" . repeat(50));
    console.error("❌ UPLOAD MIDDLEWARE ERROR:");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("=" . repeat(50));
    return res.status(500).json({ 
      message: "Error processing upload", 
      error: err.message 
    });
  }
  next();
};

// Upload endpoint
router.post("/", upload.single("file"), handleMulterError, async (req, res) => {
  try {
    console.log("📤 Upload attempt received");
    console.log("File object:", req.file ? "✅ Present" : "❌ Missing");
    
    if (!req.file) {
      console.error("❌ No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ File received:", req.file.originalname);
    console.log("File size:", req.file.size);
    console.log("File mimetype:", req.file.mimetype);

    // Determine file type
    let fileType = "document";
    if (req.file.mimetype.startsWith("image/")) {
      fileType = "image";
    } else if (req.file.mimetype === "application/pdf") {
      fileType = "pdf";
    }

    console.log("✅ File uploaded successfully to:", req.file.path);

    // Return file info
    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: req.file.path, // Cloudinary URL
      fileName: req.file.originalname,
      fileType: fileType,
      fileSize: req.file.size,
    });
  } catch (err) {
    console.error("=" . repeat(50));
    console.error("❌ UPLOAD ENDPOINT ERROR:");
    console.error("Error Message:", err.message || "No message");
    console.error("Error Name:", err.name || "Unknown");
    console.error("Error Code:", err.code || "No code");
    console.error("Error Stack:", err.stack || "No stack");
    console.error("Full Error Object:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    console.error("=" . repeat(50));
    
    res.status(500).json({ 
      message: "Error uploading file", 
      error: err.message || err.toString(),
      details: err.code || "Unknown error"
    });
  }
});

export default router;
