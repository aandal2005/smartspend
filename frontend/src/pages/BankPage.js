import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/BankPage.css";
function BankPage() {

  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const remainingBalance = budget - spent;
  const token = localStorage.getItem("token");
// eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {

    const fetchBankData = async () => {

      try {

        const res = await axios.get(
          "https://smartspend-backend.onrender.com/api/bank/budget-alert",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("BANK API RESPONSE:", res.data);

        setBudget(res.data.monthlyBudget);
        setSpent(res.data.totalSpent);

      } catch (error) {

        console.log("BANK API ERROR:", error);

      }

    };

    fetchBankData();

  }, [token]);

  return (
   
  <div className="dashboard-container">

    <div className="dashboard-content">

     <h1 className="bank-title">
  🏦 Bank Monitor
</h1>

      <div className="bank-cards">

        {/* Budget Card */}

        <div className="bank-card">

<div className="card-header">
<span className="card-icon">💰</span>
<h3>Monthly Budget</h3>
</div>

<p className="bank-value">₹{budget}</p>

<span className="bank-sub">
Budget limit this month
</span>

</div>

        {/* Spent Card */}

        <div className="bank-card">

<div className="card-header">
<span className="card-icon">💳</span>
<h3>Spent</h3>
</div>

<p className="bank-value spent">₹{spent}</p>

<span className="bank-sub">
{Math.round((spent/budget)*100)}% of budget used
</span>

</div>
<div className="bg-[#1e293b] rounded-2xl p-6 w-[260px]">
  <div className="text-gray-300 mb-2">💰 Remaining Balance</div>

  <div className="text-3xl font-bold text-green-400">
    ₹{remainingBalance}
  </div>

  <p className="text-gray-400 text-sm">
    Available to spend
  </p>
</div>

      </div>

    </div>

  </div>
);
  
}

export default BankPage;