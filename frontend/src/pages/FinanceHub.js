import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../pages/finance.css";
function FinanceHub() {

  const [budget,setBudget] = useState(0);
  const [spent,setSpent] = useState(0);

  const [score,setScore] = useState(0);
  const [insight,setInsight] = useState("");
  const [forecast,setForecast] = useState("");
  const [pattern,setPattern] = useState("");
  const [risk,setRisk] = useState("");
  const [burnRate,setBurnRate] = useState("");

  const [month,setMonth] = useState(new Date().getMonth());
  const year = new Date().getFullYear();

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  /* ---------------- LOAD DATA ---------------- */
 // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{
    fetchData();
  },[month]);

  const fetchData = async () => {

    try{

      const token = localStorage.getItem("token");

      /* ---------- GET BUDGET STATUS ---------- */

      const budgetRes = await axios.get(
        `https://smartspend-backend.onrender.com/api/budget/status?month=${month+1}&year=${year}`,
        { headers:{ Authorization:`Bearer ${token}` } }
      );

      const budgetAmount = budgetRes.data.budget || 0;
      const spentAmount = budgetRes.data.spent || 0;

      setBudget(budgetAmount);
      setSpent(spentAmount);

      /* ---------- GET EXPENSES ---------- */

      const expenseRes = await axios.get(
        "https://smartspend-backend.onrender.com/api/expenses",
        { headers:{ Authorization:`Bearer ${token}` } }
      );

      const expenses = expenseRes.data || [];

      runAnalytics(expenses,budgetAmount,spentAmount);

    }catch(error){

      console.log("FinanceHub error:",error);

    }

  };

  /* ---------------- ANALYTICS ---------------- */

  const runAnalytics = (expenses,budgetAmount,spentAmount)=>{

    if(!budgetAmount) return;

    const monthlyExpenses = expenses.filter(exp=>{
      const d = new Date(exp.date);
      return d.getMonth()===month && d.getFullYear()===year;
    });

    /* ---------- FINANCE SCORE ---------- */

    const usage = spentAmount / budgetAmount;

    let financeScore = 100;

    if(usage >= 1) financeScore = 40;
    else if(usage >= 0.8) financeScore = 60;
    else if(usage >= 0.6) financeScore = 75;
    else financeScore = 90;

    setScore(financeScore);

    /* ---------- SPENDING INTELLIGENCE ---------- */

    let categories = {};

    monthlyExpenses.forEach(e=>{
      categories[e.category] =
      (categories[e.category] || 0) + e.amount;
    });

    let highest = "No expenses";

    if(Object.keys(categories).length > 0){
      highest = Object.keys(categories).reduce(
        (a,b)=> categories[a] > categories[b] ? a : b
      );
    }

    setInsight(`${highest} is your highest spending category`);

    /* ---------- FORECAST ---------- */

    const today = new Date().getDate();

    const daysInMonth =
      new Date(year,month+1,0).getDate();

    const dailyAvg =
      today > 0 ? spentAmount / today : 0;

    const prediction =
      Math.round(dailyAvg * daysInMonth);

    setForecast(`Expected monthly spending ₹${prediction}`);

    /* ---------- SPENDING PATTERN ---------- */

    let weekend = 0;
    let weekday = 0;

    monthlyExpenses.forEach(e=>{

      const day = new Date(e.date).getDay();

      if(day===0 || day===6)
        weekend += e.amount;
      else
        weekday += e.amount;

    });

    if(weekend > weekday)
      setPattern("Most spending happens on weekends");
    else
      setPattern("Most spending happens on weekdays");

    /* ---------- RISK DETECTOR ---------- */

    const percentUsed =
      Math.round((spentAmount / budgetAmount) * 100);

    if(percentUsed >= 100)
      setRisk("⚠ Budget exceeded this month");
    else if(percentUsed >= 80)
      setRisk("⚠ You are close to exceeding budget");
    else
      setRisk(`Budget usage ${percentUsed}%`);

    /* ---------- BURN RATE ---------- */

    const safeDaily =
      Math.round(budgetAmount / daysInMonth);

    const currentRate =
      today > 0 ? Math.round(spentAmount / today) : 0;

    if(currentRate > safeDaily)
      setBurnRate(
        `⚠ Safe daily spend ₹${safeDaily}, current rate ₹${currentRate}`
      );
    else
      setBurnRate(
        `Safe daily spend ₹${safeDaily}, current rate ₹${currentRate}`
      );

  };

  /* ---------------- MONTH SWITCH ---------------- */

  const nextMonth = ()=>{
    if(month < 11) setMonth(month+1);
  };

  const prevMonth = ()=>{
    if(month > 0) setMonth(month-1);
  };

  /* ---------------- UI ---------------- */

 return (

<div className="finance-page">
  <h1 className="text-3xl font-semibold mb-6">Financial Analytics</h1>

  {/* Month Switch */}

  <div className="finance-month-switch">

    <button onClick={prevMonth} className="month-btn">⬅</button>

    <span className="month-title">
      {months[month]} {year}
    </span>

    <button onClick={nextMonth} className="month-btn">➡</button>

  </div>

  <div className="finance-grid">

    {/* FINANCIAL SCORE */}

    <div className="finance-score-card">

      <h3 className="card-title score">
  🧠 Financial Health Score
</h3>

      <div className="score-circle">
        <CircularProgressbar value={score} text={`${score}/100`} />
      </div>

      <p>Budget ₹{budget}</p>
      <p>Spent ₹{spent}</p>

    </div>


    {/* ANALYTICS CARDS */}

    <div className="finance-cards">

      <div className="finance-card">
        <h3 className="card-title">
  💡 Spending Intelligence
</h3>
        <p>{insight}</p>
      </div>

      <div className="finance-card">
       <h3 className="card-title forecast">
  📈 Monthly Spending Forecast
</h3>
        <p>{forecast}</p>
      </div>

      <div className="finance-card">
        <h3 className="card-title behavior">
  📊 Spending Behavior Analysis
</h3>
        <p>{pattern}</p>
      </div>

      <div className="finance-card">
        <h3 className="card-title risk">
  ⚠ Expense Risk Detector
</h3>
        <p>{risk}</p>
      </div>

      <div className="finance-card">
        <h3 className="card-title burn">
  🔥 Budget Burn Rate Analyzer
</h3>
        <p>{burnRate}</p>
      </div>

    </div>

  </div>

</div>

 );
}

export default FinanceHub;