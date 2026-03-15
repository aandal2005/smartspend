const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
// UPDATE PROFILE
router.put("/update-profile", protect, async (req, res) => {  try {

    const { name, email, profilePic } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, profilePic },
      { new: true }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

module.exports = router;