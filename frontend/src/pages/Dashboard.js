import { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../calendarDark.css";
import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
} from "recharts";
function Dashboard() {

  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [backendMonthly, setBackendMonthly] = useState([]);
  const [backendCategory, setBackendCategory] = useState([]);

  const [budget, setBudget] = useState(3000);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [upiImage, setUpiImage] = useState(null);
  const [upiLoading, setUpiLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [aiInsight, setAiInsight] = useState("");

  const [aiSummary, setAiSummary] = useState({});

  // ✅ ADD THIS HERE
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    fetchExpenses();
  fetchBackendMonthly();
  fetchBackendCategory();

}, [selectedYear]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

  const fetchSummary = async () => {
    try {

      const res = await axios.get(
        "https://smartspend-backend-tt84.onrender.com/api/expenses/summary/ai",
        config
      );

      setAiSummary(res.data);

    } catch (error) {
      console.error("AI summary error:", error);
    }
  };

  fetchSummary();

}, [selectedDate]);
  const fetchExpenses = async () => {
  try {

    const res = await axios.get(
      "https://smartspend-backend-tt84.onrender.com/api/expenses",
      config
    );

    setExpenses(res.data);

    const sum = res.data.reduce((acc, item) => acc + Number(item.amount), 0);
    setTotal(sum);

  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
};
  const handleAddExpense = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      "https://smartspend-backend-tt84.onrender.com/api/expenses",
      newExpense,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewExpense({ description: "", amount: "", category: "" });
    fetchExpenses();
  };
  const handleUPIScreenshotUpload = async () => {
  if (!upiImage) return;

  const formData = new FormData();
  formData.append("image", upiImage);

  try {
    setUpiLoading(true);
    const token = localStorage.getItem("token");

    await axios.post(
      "https://smartspend-backend-tt84.onrender.com/api/expenses/upi-screenshot",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("✅ UPI Expense Added Successfully");
    setUpiImage(null);
    fetchExpenses();
    fetchBackendMonthly();
    fetchBackendCategory();

  } catch (err) {
    alert("❌ Could not detect UPI details");
  } finally {
    setUpiLoading(false);
  }
};
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(
      `https://smartspend-backend-tt84.onrender.com/api/expenses/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchExpenses();
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `https://smartspend-backend-tt84.onrender.com/api/expenses/${id}`,
      editedData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingId(null);
    fetchExpenses();
  };
  
  const fetchBackendMonthly = async () => {

  const res = await axios.get(
    "https://smartspend-backend-tt84.onrender.com/api/expenses/summary/monthly?year=2026",
    config
  );

  setBackendMonthly(res.data);
};

const fetchBackendCategory = async () => {

  const res = await axios.get(
    "https://smartspend-backend-tt84.onrender.com/api/expenses/summary/category",
    config
  );

  setBackendCategory(res.data);
};
  const generateAIInsight = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://smartspend-backend-tt84.onrender.com/api/expenses/ai-insights",
      { expenses },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAiInsight(res.data.insight);
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchCategory = categoryFilter
      ? exp.category === categoryFilter
      : true;

    const matchDate = dateFilter
      ? new Date(exp.date).toISOString().slice(0, 10) === dateFilter
      : true;

    return matchCategory && matchDate;
  });


  const paymentScore = Math.min(total / 100, 100);

  const calculateGrowth = () => {
    if (expenses.length < 2) return 0;
    const sorted = [...expenses].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const first = Number(sorted[0].amount);
    const last = Number(sorted[sorted.length - 1].amount);
    if (first === 0) return 0;
    return (((last - first) / first) * 100).toFixed(2);
  };
 
  const monthlyData = [];
  expenses.forEach((item) => {
    const month = new Date(item.date).toLocaleString("default", {
      month: "short",
    });
    const existing = monthlyData.find((m) => m.month === month);
    if (existing)existing.total += Number(item.amount) ;
    else monthlyData.push({ month, total: item.amount });
  });

  const categoryData = [];
  expenses.forEach((item) => {
    const existing = categoryData.find(
      (c) => c.name === item.category
    );
    if (existing) existing.value += Number(item.amount);
    else categoryData.push({ name: item.category, value: item.amount });
  });
  
  const calculateMonthlyGrowth = () => {
  if (backendMonthly.length < 2) return 0;

  const sorted = [...backendMonthly];
  const last = sorted[sorted.length - 1].total;
  const prev = sorted[sorted.length - 2].total;

  if (prev === 0) return 0;

  return (((last - prev) / prev) * 100).toFixed(2);
};
const getHighestMonth = () => {
  if (!backendMonthly.length) return null;

  return backendMonthly.reduce((max, current) =>
    current.total > max.total ? current : max
  );
};

  return (
<div className="p-4 bg-[#0f172a] min-h-screen text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
        </div>

        {/* Add Expense */}
     <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-4 mb-6">

<h3 className="mb-4 text-lg font-semibold">Add Expense</h3>

<div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
  <input
    placeholder="Description"
    value={newExpense.description}
    onChange={(e) =>
      setNewExpense({ ...newExpense, description: e.target.value })
    }
    className="bg-[#0f172a] border border-slate-700 p-2 rounded-xl"
  />

  <input
    type="number"
    placeholder="Amount"
    value={newExpense.amount}
    onChange={(e) =>
      setNewExpense({ ...newExpense, amount: e.target.value })
    }
    className="bg-[#0f172a] border border-slate-700 p-2 rounded-xl"
  />

  <input
    placeholder="Category"
    value={newExpense.category}
    onChange={(e) =>
      setNewExpense({ ...newExpense, category: e.target.value })
    }
    className="bg-[#0f172a] border border-slate-700 p-2 rounded-xl"
  />

  <button
    onClick={handleAddExpense}
    className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold"
  >
    Add
  </button>
</div>

{/* UPI Screenshot Upload */}

<div className="flex items-center gap-4">

<input
  type="file"
  accept="image/*"
  onChange={(e) => setUpiImage(e.target.files[0])}
/>

<button
  onClick={handleUPIScreenshotUpload}
  className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-xl font-semibold"
>
  {upiLoading ? "Processing..." : "Upload UPI Screenshot"}
</button>

</div>

</div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="bg-[#1e293b] rounded-2xl p-4 xl:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Revenue</h2>
            <div className="text-4xl font-bold text-indigo-400 mb-6">
              ₹<CountUp end={total} duration={1.2} />
            </div>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="total" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

<div className="bg-[#1e293b] rounded-2xl p-4 flex justify-center items-center">            <Calendar onChange={setSelectedDate} value={selectedDate} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-3">
          <div className="bg-[#1e293b] rounded-2xl p-4">
  <h3 className="font-semibold mb-4">AI Summary</h3>
  <p className="text-gray-400">
    Total ₹{aiSummary?.total || 0}, 
{aiSummary?.count || 0} transactions, 
Average ₹{aiSummary?.average ? aiSummary.average.toFixed(2) : 0}
  </p>
</div>

         

          <div className="bg-[#1e293b] rounded-2xl p-4">
            <h3 className="font-semibold mb-4">Payment Score</h3>
            <div className="w-full bg-slate-700 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${paymentScore}%` }}
              ></div>
            </div>
            <div className="mt-4 text-green-400 font-semibold">
              {paymentScore.toFixed(0)}%
            </div>
          </div>
        </div>
        {/* ================= NEW ADVANCED ANALYTICS ================= */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-3">

  {/* Backend Monthly Chart */}
  <div className="bg-[#1e293b] rounded-2xl p-4">
    <h2 className="text-lg font-semibold mb-4">
      📈 Advanced Monthly Analytics
    </h2>
    {/* Year Filter */}
<select
  value={selectedYear}
  onChange={(e) => setSelectedYear(Number(e.target.value))}
  className="bg-[#0f172a] border border-slate-700 p-2 rounded-xl mb-4"
>
  <option value={2025}>2025</option>
  <option value={2026}>2026</option>
  <option value={2027}>2027</option>
</select>
{/* Budget Input */}
<div className="mb-4">
  <input
    type="number"
    placeholder="Set Monthly Budget"
    value={budget}
    onChange={(e) => setBudget(Number(e.target.value))}
    className="bg-[#0f172a] border border-slate-700 p-2 rounded-xl"
  />
</div>
<div className="mb-4 text-green-400 font-semibold">
  Growth: {calculateMonthlyGrowth()}%
</div>
    <div className="h-[170px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={backendMonthly || []}>
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Bar dataKey="total" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
  
  {/* Backend Category Pie */}
   <div className="bg-[#1e293b] rounded-2xl p-4">
    <h2 className="text-lg font-semibold mb-4">
      📊 Advanced Category Distribution
    </h2>

    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={backendCategory}
            dataKey="amount"
            nameKey="category"
            outerRadius={110}
            fill="#f59e0b"
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>

</div>
{getHighestMonth() && (
  <div className="mt-4 text-yellow-400 font-semibold">
    🔥 Highest: {getHighestMonth().month} (₹{getHighestMonth().total})
  </div>
)}
{backendMonthly.length > 0 &&
  backendMonthly[backendMonthly.length - 1].total > budget && (
    <div className="mt-4 text-red-500 font-bold">
      ⚠ Budget Exceeded This Month!
    </div>
)}
        {/* Filters */}
        <div className="flex gap-4 mt-3 mb-4">
          <select
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1e293b] px-4 py-2 rounded-xl"
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
          </select>

          <input
            type="date"
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#1e293b] px-4 py-2 rounded-xl"
          />

          <div className="text-green-400 font-semibold">
            Growth: {calculateGrowth()}%
          </div>
        </div>

        {/* Expense Table */}
        <div className="bg-[#1e293b] rounded-2xl p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-slate-700">
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp._id} className="border-b border-slate-800">
                  <td>
                    {editingId === exp._id ? (
                      <input
                        value={editedData.description}
                        onChange={(e) =>
                          setEditedData({ ...editedData, description: e.target.value })
                        }
                      />
                    ) : (
                      exp.description
                    )}
                  </td>
                  <td>{exp.category}</td>
                  <td style={{ color: exp.type === "income" ? "#2ecc71" : "white" }}>
  {exp.type === "income"
    ? `+₹${exp.amount}`
    : `₹${exp.amount}`}
</td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="py-4 flex gap-2">
                    {editingId === exp._id ? (
                      <button onClick={() => handleUpdate(exp._id)}      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm font-medium transition duration-200"
>
                        
                        Save</button>

                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(exp._id);
                          setEditedData(exp);
                        }}      className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1 rounded-lg text-sm font-medium transition duration-200"

                      >
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDelete(exp._id)}    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm font-medium transition duration-200"
>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        


        {/* AI Dynamic Insight */}
        <div className="bg-[#1e293b] rounded-2xl p-4 mt-6">
          <button
            onClick={generateAIInsight}
            className="bg-indigo-600 px-4 py-2 rounded-xl mb-4"
          >
            Generate AI Insight
          </button>
          <p>{aiInsight}</p>
        </div>

      </div>
  
            );
}

export default Dashboard;