import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import BudgetPage from "./pages/BudgetPage";
import FinanceHub from "./pages/FinanceHub";
import ProfilePage from "./pages/ProfilePage";
import BankPage from "./pages/BankPage";
function App() {

  const token = localStorage.getItem("token");

  return (
    <Router>

      {!token ? (

        /* PUBLIC ROUTES */
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirect everything to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>

      ) : (

        /* PRIVATE ROUTES */
        <div style={{ display: "flex" }}>

          <Sidebar />

          <div style={{ flex: 1 }}>

            <Routes>

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/expenses" element={<FinanceHub />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/bank" element={<BankPage />} />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/dashboard" />} />

            </Routes>

          </div>

        </div>

      )}

    </Router>
  );
}

export default App;