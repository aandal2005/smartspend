const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  setBudget,
  getBudgetStatus,
  getBudgetAnalytics,
  getBudgetHistory
} = require("../controllers/budgetController");

router.post("/setBudget", protect, setBudget);

router.get("/status", protect, getBudgetStatus);

router.get("/analytics", protect, getBudgetAnalytics);

router.get("/history", protect, getBudgetHistory);

module.exports = router;