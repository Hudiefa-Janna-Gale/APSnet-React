import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserCircle, FaUser } from "react-icons/fa";
import api from "../api";
import toast from "react-hot-toast";

function Login({ onLogin }) {
  const navigate = useNavigate();

  // isRegister: false = Login mode, true = Register mode
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Client side validation ---
    if (isRegister && fullName.trim() === "") {
      toast.error("Please enter your full name!");
      return;
    }
    if (email.trim() === "") {
      toast.error("Please enter your email!");
      return;
    }
    if (password.trim() === "") {
      toast.error("Please enter your password!");
      return;
    }
    if (isRegister && password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      if (isRegister) {
        // POST /api/users/register
        const res = await api.post("/users/register", {
          fullName,
          email,
          passwordHash: password,
        });
        toast.success(res.data.message);
        // Isla markiiba ku gal account-ka cusub
        if (onLogin) {
          setTimeout(() => {
            onLogin(res.data.user);
            navigate("/");
          }, 1200);
        }
      } else {
        // POST /api/users/login
        const res = await api.post("/users/login", { email, password });
        toast.success(res.data.message);
        if (onLogin) {
          setTimeout(() => {
            onLogin(res.data.user);
            navigate("/");
          }, 1200);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Is the API running?");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center p-6">

      <div className="bg-white rounded-[2rem] shadow-2xl flex max-w-4xl w-full overflow-hidden min-h-[500px]">

        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-blue-500 to-blue-800 text-white p-12 flex-col justify-center relative overflow-hidden">

          <div className="absolute -right-10 top-0 bottom-0 w-32 bg-white opacity-15 rounded-l-full transform scale-y-125"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Welcome to the <br /> ShopHub Community!
            </h1>

            <p className="text-blue-100 text-sm">
              Join our community and enjoy exclusive shopping experiences.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">

          <div className="flex justify-center mb-4">
            <FaUserCircle className="text-7xl text-gray-300" />
          </div>

          <p className="text-center text-gray-500 text-sm mb-6">
            {isRegister ? "Create your account below." : "Login below to get started."}
          </p>


          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full name: kaliya marka la is-diiwaangelinayo */}
            {isRegister && (
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            )}

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                placeholder="E-mail Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input
                type="checkbox"
                id="remember"
                className="accent-blue-500"
              />
              <label htmlFor="remember">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-400 to-blue-400 hover:from-blue-500 hover:to-blue-500 text-white font-bold py-3 rounded-full transition"
            >
              {isRegister ? "Create Account" : "Login"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            {isRegister ? "Already have an account? " : "New User? "}
            <span
              className="text-blue-500 font-semibold cursor-pointer hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Login here" : "Register here"}
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
