const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const { protect } = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

router.get("/budget-alert", protect, async (req, res) => {

  console.log("BANK ROUTE HIT");

  try {

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const budgetData = await Budget.findOne({
      user: req.user._id,
      month,
      year
    });

    const startOfMonth = new Date(year, month - 1, 1);
const endOfMonth = new Date(year, month, 0, 23, 59, 59);

const expenses = await Expense.find({
  user: req.user._id,
  date: {
    $gte: startOfMonth,
    $lte: endOfMonth
  }
});

    const totalSpent = expenses.reduce(
      (acc, item) => acc + Number(item.amount),
      0
    );

    const monthlyBudget = budgetData ? budgetData.monthlyLimit : 0;

    console.log("Monthly Budget:", monthlyBudget);
    console.log("Total Spent:", totalSpent);

    // 🚨 CHECK IF BUDGET EXCEEDED
    if (monthlyBudget > 0 && totalSpent > monthlyBudget) {

      console.log("Budget exceeded, sending email...");

      await sendEmail(
  req.user.email,
  "SmartSpend Budget Alert",
  `Dear ${req.user.name},

⚠ Budget Alert from SmartSpend

Your monthly budget limit has been exceeded.

Budget Limit : ₹${monthlyBudget}
Total Spent  : ₹${totalSpent}

Please review your spending.

SmartSpend Team`
);

    }

    res.json({
      monthlyBudget,
      totalSpent
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error fetching bank data"
    });

  }

});

module.exports = router;