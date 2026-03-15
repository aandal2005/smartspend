const Budget = require("../models/Budget");
const Expense = require("../models/Expense");


// =============================
// Budget Analytics
// =============================
const getBudgetAnalytics = async (req,res)=>{

  try{

    const month = parseInt(req.query.month) || new Date().getMonth()+1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const expenses = await Expense.find({
      user:req.user._id
    });

    const filteredExpenses = expenses.filter(exp=>{

      const d = new Date(exp.date);

      return (
        d.getMonth()+1 === month &&
        d.getFullYear() === year
      );

    });

    let totalSpent = 0;
    let categoryMap = {};
    let weekly = [0,0,0,0];

    filteredExpenses.forEach(exp=>{

      totalSpent += exp.amount;

      if(!categoryMap[exp.category]){
        categoryMap[exp.category] = 0;
      }

      categoryMap[exp.category] += exp.amount;

      const day = new Date(exp.date).getDate();

      if(day <=7) weekly[0] += exp.amount;
      else if(day <=14) weekly[1] += exp.amount;
      else if(day <=21) weekly[2] += exp.amount;
      else weekly[3] += exp.amount;

    });

    res.json({
      totalSpent,
      categorySpending:categoryMap,
      weeklySpending:weekly
    });

  }catch(error){

    res.status(500).json({message:"Server Error"});

  }

};


// =============================
// Set Budget
// =============================
const setBudget = async (req,res)=>{

  try{

    const {monthlyLimit,month,year} = req.body;

    let budget = await Budget.findOne({
      user:req.user._id,
      month,
      year
    });

    if(budget){

      budget.monthlyLimit = monthlyLimit;
      await budget.save();

    }else{

      budget = await Budget.create({
        user:req.user._id,
        month,
        year,
        monthlyLimit
      });

    }

    res.json(budget);

  }catch(error){

    res.status(500).json({message:error.message});

  }

};


// =============================
// Get Budget Status
// =============================
const getBudgetStatus = async (req,res)=>{

  try{

    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    const budget = await Budget.findOne({
      user:req.user._id,
      month,
      year
    });

    const expenses = await Expense.find({
      user:req.user._id
    });

    const filteredExpenses = expenses.filter(exp=>{

      const d = new Date(exp.date);

      return (
        d.getMonth()+1 === month &&
        d.getFullYear() === year
      );

    });

    const spent = filteredExpenses.reduce((sum,e)=>sum + e.amount,0);

    res.json({

      budget:budget ? budget.monthlyLimit : 0,
      spent,
      remaining:budget ? budget.monthlyLimit - spent : 0

    });

  }catch(error){

    res.status(500).json({message:error.message});

  }

};


// =============================
// Budget History
// =============================
const getBudgetHistory = async (req,res)=>{

  try{

    const budgets = await Budget.find({
      user:req.user._id
    }).sort({year:1,month:1});

    res.json(budgets);

  }catch(error){

    res.status(500).json({message:error.message});

  }

};


// =============================
// Export Controllers
// =============================
module.exports = {
  setBudget,
  getBudgetStatus,
  getBudgetAnalytics,
  getBudgetHistory
};