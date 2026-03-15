import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "https://smartspend-backend-tt84.onrender.com/api/auth/register",
        { name, email, password }
      );

      alert("Registration successful");

      navigate("/login");

    } catch (error) {
  console.log(error.response.data);
  alert(error.response?.data?.message || "Registration failed");
}

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-white">

      <div className="bg-[#1e293b] p-10 rounded-2xl w-[400px] border border-slate-700">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          SmartSpend Register
        </h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Enter Name"
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-3 rounded-xl bg-[#0f172a] border border-slate-700"
          />

          <input
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded-xl bg-[#0f172a] border border-slate-700"
          />

          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded-xl bg-[#0f172a] border border-slate-700"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-xl font-semibold"
          >
            Register
          </button>

        </form>

      </div>
    </div>
  );
}

export default Register;