import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BudgetPage.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function BudgetPage() {

  const [budget, setBudget] = useState("");

  const [status, setStatus] = useState({
    budget: 0,
    spent: 0,
    remaining: 0
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [weekly, setWeekly] = useState([0,0,0,0]);
  const [category, setCategory] = useState({});

  // Month name
  const monthName = selectedDate.toLocaleString("default",{month:"long"});
  const year = selectedDate.getFullYear();

  // Change month
  const changeMonth = (direction)=>{

    const newDate = new Date(selectedDate);

    if(direction === "next"){
      newDate.setMonth(newDate.getMonth()+1);
    }

    if(direction === "prev"){
      newDate.setMonth(newDate.getMonth()-1);
    }

    setSelectedDate(newDate);

  };

  // Budget percent
  const percent =
    status.budget > 0 ? (status.spent / status.budget) * 100 : 0;

  // Food spending
  const foodSpent = category["Food"] || 0;

  const aiSuggestion =
    foodSpent > 3000
      ? "Reduce food delivery to save ₹2000/month"
      : null;

  const predictedOverspend =
    status.spent > status.budget * 0.8
      ? Math.round(status.spent * 1.2 - status.budget)
      : null;


  // Fetch budget
  const fetchStatus = async () => {

  try{

    const res = await axios.get(
      `https://smartspend-backend.onrender.com/api/budget/status?month=${selectedDate.getMonth()+1}&year=${selectedDate.getFullYear()}`,
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setStatus(res.data);

  }catch(error){
    console.log(error);
  }

};

  // Fetch analytics
  const fetchAnalytics = async ()=>{

    try{

      const res = await axios.get(
  `hhttps://smartspend-backend.onrender.com/api/budget/analytics?month=${selectedDate.getMonth()+1}&year=${selectedDate.getFullYear()}`,
  {
    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }
  }
);

      setWeekly(res.data.weeklySpending);
      setCategory(res.data.categorySpending);

    }catch(error){
      console.log(error);
    }

  };


  // Set budget
  const setMonthlyBudget = async ()=>{

  try{

    await axios.post(
      "https://smartspend-backend.onrender.com/api/budget/setBudget",
      {
        monthlyLimit: Number(budget),
        month:selectedDate.getMonth()+1,
        year:selectedDate.getFullYear()
      },
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setBudget(""); // clear input

    fetchStatus();
    fetchAnalytics();   // IMPORTANT

  }catch(error){
    console.log(error);
  }

};

  useEffect(()=>{

    fetchStatus();
    fetchAnalytics();

  },[selectedDate]);


  const chartData = [
    { name:"Budget", value:status.budget },
    { name:"Spent", value:status.spent }
  ];

  const weeklyData = [
    {week:"Week 1",amount:weekly[0]},
    {week:"Week 2",amount:weekly[1]},
    {week:"Week 3",amount:weekly[2]},
    {week:"Week 4",amount:weekly[3]}
  ];


  return(

    <div className="budget-page">

      <h1 className="budget-title">💰 Monthly Budget</h1>


      {/* Month Selector */}

      <div className="month-selector">

        <button onClick={()=>changeMonth("prev")}>⬅</button>

        <h2>{monthName} {year}</h2>

        <button onClick={()=>changeMonth("next")}>➡</button>

      </div>


      {/* Budget Card */}

      <div className="budget-card">

        <h3>💰 Budget ₹{status.budget}</h3>

      </div>


      {/* Budget Input */}

      <div className="budget-input-card">

        <input
          type="number"
          placeholder="Enter monthly budget"
          value={budget}
          onChange={(e)=>setBudget(e.target.value)}
        />

        <button onClick={setMonthlyBudget}>
          Set Budget
        </button>

      </div>


      {/* Budget Stats */}

      <div className="budget-stats">

        <div className="budget-box">
          <p>Budget</p>
          <h2>₹{status.budget}</h2>
        </div>

        <div className="budget-box">
          <p>Spent</p>
          <h2>₹{status.spent}</h2>
        </div>

        <div className="budget-box">
          <p>Remaining</p>
          <h2>₹{status.remaining}</h2>
        </div>

      </div>


      {/* Progress Bar */}

      <div className="progress-container">

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{width:`${percent}%`}}
          />
        </div>

        <p className="progress-text">
          {percent.toFixed(0)}% of budget used
        </p>

      </div>


      {/* Alerts */}

      {percent>80 && percent<100 && (
        <div className="warning">
          ⚠ You have used 80% of your budget
        </div>
      )}

      {percent>=100 && (
        <div className="danger">
          ❌ Budget exceeded!
        </div>
      )}


      {/* AI Category Alert */}

      {foodSpent>3000 && (
        <div className="ai-warning">
          ⚠ You are spending more on <b>Food</b> this month
        </div>
      )}


      {/* AI Suggestion */}

      {aiSuggestion && (
        <div className="ai-suggestion">
          🧠 AI Spending Suggestions
          <p>AI Tip: {aiSuggestion}</p>
        </div>
      )}


      {/* Overspending Prediction */}

      {predictedOverspend>0 && (
        <div className="prediction-box">
          📉 Overspending Prediction
          <p>You may exceed your budget by ₹{predictedOverspend}</p>
        </div>
      )}


      {/* Charts */}

      <div className="charts-grid">

        <div className="chart-card">

          <h3>📊 Budget vs Spending</h3>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="value"/>
            </BarChart>
          </ResponsiveContainer>

        </div>


        <div className="chart-card">

          <h3>📅 Weekly Spending</h3>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="week"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="amount"/>
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}

export default BudgetPage;