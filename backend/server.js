require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");
const budgetRoutes = require("./routes/BudgetRoutes");
const userRoutes = require("./routes/userRoutes");
const bankRoutes = require("./routes/bankRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));
app.get("/", (req, res) => {
  res.send("SmartSpend API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bank", bankRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});