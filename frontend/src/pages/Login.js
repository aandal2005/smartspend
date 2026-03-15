import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
  "https://smartspend-backend-tt84.onrender.com/api/auth/login",
  { email, password }
);

localStorage.setItem("token", res.data.token);
navigate("/dashboard");

    } catch (error) {
  console.log(error.response.data);
  alert(error.response?.data?.message || "Login failed");
}

  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-white">

    <div className="bg-[#1e293b] p-10 rounded-2xl w-[400px] border border-slate-700">

      <h2 className="text-2xl font-semibold mb-6 text-center">
        SmartSpend Login
      </h2>

      <form onSubmit={handleLogin}>

        <input
  type="email"
  placeholder="Enter Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full mb-4 p-3 rounded-xl bg-[#0f172a] border border-slate-700"
/>

<input
  type="password"
  placeholder="Enter Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full mb-6 p-3 rounded-xl bg-[#0f172a] border border-slate-700"
/>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded-xl font-semibold"
        >
          Login
        </button>

      </form>

      <div className="text-center mt-6 text-gray-400">
        New user?
      </div>

      <button
        onClick={() => navigate("/register")}
        className="w-full mt-2 bg-purple-600 hover:bg-purple-700 p-3 rounded-xl font-semibold"
      >
        Register
      </button>

    </div>
  </div>
);

}

export default Login;