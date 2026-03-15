const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  description: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  category: {
    type: String
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    default: "expense"
  },

  date: {
    type: Date,
    default: Date.now
  }


},
{ timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);