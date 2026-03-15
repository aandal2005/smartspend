const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");


// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);


// TEST LOGIN (optional)
router.get("/testlogin", async (req, res) => {

  const user = await User.findOne({ email: "aandal@gmail.com" });

  if (!user) {
    return res.json({ message: "User not found" });
  }

  const token = generateToken(user._id);

  res.json({
    message: "Login success",
    token,
  });

});


// GET USER PROFILE
router.get("/profile", protect, async (req, res) => {

  try {

    const user = await User.findById(req.user._id).select("-password");

    res.json(user);

  } catch (error) {

    res.status(500).json({ message: "Failed to load profile" });

  }

});


module.exports = router;