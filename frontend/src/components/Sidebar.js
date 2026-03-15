import React from "react";
import { Link } from "react-router-dom";
import {
  MdDashboard,
  MdAccountBalanceWallet,
  MdReceiptLong,
  MdPerson
} from "react-icons/md";
import "./Sidebar.css";
function Sidebar() {
  return (
    <div className="sidebar">

      <Link to="/dashboard">
        <MdDashboard size={28} color="white" />
      </Link>

      <Link to="/budget">
        <MdAccountBalanceWallet size={28} color="white" />
      </Link>

      <Link to="/expenses">
        <MdReceiptLong size={28} color="white" />
      </Link>

      <Link to="/profile">
        <MdPerson size={28} color="white" />
      </Link>

    </div>
  );
}

export default Sidebar;