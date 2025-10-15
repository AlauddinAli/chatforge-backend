

// import express from "express";
// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// // ===== REGISTER USER =====
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists ❌" });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user in DB
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     // Generate JWT token (include name + email)
//     const token = jwt.sign(
//       { id: user._id, name: user.name, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // ✅ FIXED: use status(201), not res.json(201).json
//     res.status(201).json({
//       message: "User registered successfully ✅",
//       user: { id: user._id, name: user.name, email: user.email },
//       token,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error ❌", error: err.message });
//   }
// });

// // ===== LOGIN USER =====
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User does not exist ❌" });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials ❌" });
//     }

//     // Generate JWT token (include name + email here too!)
//     const token = jwt.sign(
//       { id: user._id, name: user.name, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       message: "Login successful ✅",
//       user: { id: user._id, name: user.name, email: user.email },
//       token,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error ❌", error: err.message });
//   }
// });

// export default router;

// backend/routes/auth.js
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// ===== MIDDLEWARE: Verify JWT Token =====
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ===== REGISTER USER =====
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully ✅",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error ❌", error: err.message });
  }
});

// ===== LOGIN USER =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error ❌", error: err.message });
  }
});

// ===== 🔥 NEW: UPDATE USER PROFILE =====
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    // Update name and email
    if (name) user.name = name.trim();
    if (email) {
      // Check if new email is already taken
      const emailExists = await User.findOne({ email, _id: { $ne: req.userId } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use ❌" });
      }
      user.email = email.trim();
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password required ❌" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect ❌" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Save updated user
    await user.save();

    // Generate new token with updated info
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Profile updated successfully ✅",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error ❌", error: err.message });
  }
});

export default router;