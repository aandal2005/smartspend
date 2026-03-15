const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getDashboardSummary,
  getCategorySummary,
  getMonthlySummary,
  importCSV,
  exportCSV,
  importUPI,
  importUPIScreenshot,
  getAISummary
} = require("../controllers/expenseController");


// ================= BASIC CRUD =================

// Add Expense
router.post("/", protect, addExpense);

// Get All Expenses
router.get("/", protect, getExpenses);

// Update Expense
router.put("/:id", protect, updateExpense);

// Delete Expense
router.delete("/:id", protect, deleteExpense);


// ================= UPI SCREENSHOT IMPORT =================

router.post("/upi-screenshot", protect, upload.single("image"), importUPIScreenshot);


// ================= DASHBOARD & ANALYTICS =================

// Dashboard Summary
router.get("/summary/dashboard", protect, getDashboardSummary);

// Category Summary
router.get("/summary/category", protect, getCategorySummary);

// Monthly Summary
router.get("/summary/monthly", protect, getMonthlySummary);
router.get("/summary/ai", protect, getAISummary);

// ================= CSV FEATURES =================

// Import CSV
router.post("/import", protect, upload.single("file"), importCSV);

// Export CSV
router.get("/export", protect, exportCSV);


// ================= UPI SMS IMPORT =================

router.post("/upi-import", protect, importUPI);


module.exports = router;