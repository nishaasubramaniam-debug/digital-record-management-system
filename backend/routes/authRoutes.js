const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");   // ✅ Add this

const {
  register,
  login,
  updateProfile,
} = require("../controllers/authController");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Update Profile
router.put("/profile", auth, updateProfile);   // ✅ Add auth here

module.exports = router;
