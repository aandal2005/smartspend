const fs = require("fs");
const csv = require("csv-parser");
const Expense = require("../models/Expense");
const autoDetectCategory = require("../utils/autoCategory");
const extractText = require("../utils/visionOCR");
const parseWithGemini = require("../utils/geminiParser");
const categorizeTransaction = require("../utils/localCategorizer");


// ================= ADD EXPENSE =================
const addExpense = async (req, res) => {
  try {

    const { amount, description, category,type, date } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      description,
      amount,
      category: category || await categorizeTransaction(description),
      type: type || "expense",
      paymentMethod: "Manual",
      date: date ? new Date(date) : new Date()
    });

    res.status(201).json(expense);

  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================= GET ALL EXPENSES =================
const getExpenses = async (req, res) => {
  try {

    const expenses = await Expense
      .find({ user: req.user._id })
      .sort({ date: -1 });

    res.json(expenses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE EXPENSE =================
const deleteExpense = async (req, res) => {
  try {

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= UPDATE EXPENSE =================
const updateExpense = async (req, res) => {
  try {

    const { description, amount, category,type, date } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.type = type || expense.type;
    expense.date = date || expense.date;

    const updatedExpense = await expense.save();

    res.json(updatedExpense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DASHBOARD SUMMARY =================
// ================= DASHBOARD SUMMARY =================
const getDashboardSummary = async (req, res) => {
  try {

    const transactions = await Expense.find({ user: req.user._id });

    let income = 0;
    let expense = 0;

    transactions.forEach(t => {

      if (t.type === "income") {
        income += t.amount;
      } else {
        expense += t.amount;
      }

    });

    const balance = income - expense;

    res.json({
      income,
      expense,
      balance,
      totalTransactions: transactions.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= CATEGORY SUMMARY =================
const getCategorySummary = async (req, res) => {
  try {

    const summary = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" }
        }
      }
    ]);

    res.json(summary.map(item => ({
      category: item._id,
      amount: item.amount
    })));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= MONTHLY SUMMARY =================
const getMonthlySummary = async (req, res) => {
  try {

    const summary = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: new Date(`${req.query.year}-01-01`),
            $lt: new Date(`${req.query.year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = [
      "", "Jan","Feb","Mar","Apr",
      "May","Jun","Jul","Aug",
      "Sep","Oct","Nov","Dec"
    ];

    const formatted = summary.map(item => ({
      month: `${monthNames[item._id.month]} ${item._id.year}`,
      total: item.total
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= IMPORT CSV =================
const importCSV = (req, res) => {

  const results = [];

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {

      try {

        for (let row of results) {

          await Expense.create({
            user: req.user._id,
            amount: Number(row.Amount),
            description: row.Description,
            category: autoDetectCategory(row.Description),
            date: row.Date || new Date()
          });

        }

        res.json({
          message: "File imported successfully",
          insertedCount: results.length
        });

      } catch (error) {
        res.status(500).json({ message: error.message });
      }

    });
};


// ================= EXPORT CSV =================
const exportCSV = async (req, res) => {

  try {

    const expenses = await Expense.find({ user: req.user._id });

    let csvData = "Amount,Description,Category,Date\n";

    expenses.forEach(exp => {
      csvData += `${exp.amount},${exp.description},${exp.category},${exp.date}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("expenses.csv");
    res.send(csvData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


// ================= IMPORT UPI SMS =================
const importUPI = async (req, res) => {

  try {

    const { message } = req.body;

    const amountMatch = message.match(/Rs\.?\s?(\d+)/i);
    const merchantMatch = message.match(/to\s([A-Za-z0-9\s]+)/i);

    if (!amountMatch || !merchantMatch) {
      return res.status(400).json({ message: "Invalid UPI SMS format" });
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount: parseFloat(amountMatch[1]),
      description: merchantMatch[1].trim(),
      category: "UPI",
      type,
      paymentMethod: "UPI",
      date: new Date()
    });

    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


// ================= IMPORT UPI SCREENSHOT =================
const importUPIScreenshot = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const text = await extractText(req.file.path);

    const cleanedText = text.replace(/\n+/g, " ");

    const transactions = await parseWithGemini(cleanedText);

    const savedExpenses = [];

    for (const tx of transactions) {

  // skip credits
  if (tx.type !== "debit") continue;

  // skip invalid amounts
  if (!tx.amount || tx.amount <= 0) continue;

  const expense = await Expense.create({
    user: req.user._id,
    description: tx.description,
    amount: Number(tx.amount),
    category: tx.category || categorizeTransaction(tx.description),
    type: "expense",
    paymentMethod: "UPI",
    date: tx.date ? new Date(tx.date) : new Date()
  });



      savedExpenses.push(expense);

    }

    res.json(savedExpenses);

  } catch (error) {

    console.error("Screenshot Import Error:", error);

    res.status(500).json({ message: error.message });

  }

};
// ================= AI SUMMARY BY DATE =================
const getAISummary = async (req, res) => {

  try {

    const { date } = req.query;

    let filter = { user: req.user._id };

    if (date) {

      const start = new Date(date);
      const end = new Date(date);

      end.setDate(end.getDate() + 1);

      filter.date = {
        $gte: start,
        $lt: end
      };

    }

    const transactions = await Expense.find(filter);

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    const avg = transactions.length
      ? total / transactions.length
      : 0;

    res.json({
      total,
      count: transactions.length,
      average: avg
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// ================= EXPORT ALL =================
module.exports = {
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
};