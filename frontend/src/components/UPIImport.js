import React from "react";
import { Link } from "react-router-dom";
import { MdDashboard, MdAccountBalanceWallet, MdReceiptLong } from "react-icons/md";

import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <Link to="/dashboard" className="sidebar-item">
        <MdDashboard size={26} />
        <span>Dashboard</span>
      </Link>

      <Link to="/budget" className="sidebar-item">
        <MdAccountBalanceWallet size={26} />
        <span>Budget</span>
      </Link>

      <Link to="/expenses" className="sidebar-item">
        <MdReceiptLong size={26} />
        <span>Expenses</span>
      </Link>

    </div>
  );
}

export default Sidebar;