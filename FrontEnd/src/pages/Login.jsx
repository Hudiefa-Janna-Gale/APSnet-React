import { useState } from "react";
import { FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State cusub oo lagu kaydiyo fariinta guusha ama cilada
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hubi in labada meeloodba la buuxiyey
    if (email.trim() === "") {
      setMessage({ text: "Fadlan geli Gmail-kaaga!", type: "error" });
      return;
    }

    if (password.trim() === "") {
      setMessage({ text: "Fadlan geli Password-kaaga!", type: "error" });
      return;
    }

    // Haddii wax walba sax yihiin
    setMessage({ text: "Hambalyo! Waxaad ku guulaysatay Login-kaaga. 🎉", type: "success" });

    // Haddii ay jirto function loo soo baasay onLogin, ka shaqaysii ka dib 1.5 ilbiriqsi
    if (onLogin) {
      setTimeout(() => {
        onLogin(email);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center p-6">

      <div className="bg-white rounded-[2rem] shadow-2xl flex max-w-4xl w-full overflow-hidden min-h-[500px]">

        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-orange-400 to-amber-500 text-white p-12 flex-col justify-center relative overflow-hidden">

          <div className="absolute -right-10 top-0 bottom-0 w-32 bg-white opacity-15 rounded-l-full transform scale-y-125"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Welcome to the <br /> Florist Community!
            </h1>

            <p className="text-orange-100 text-sm">
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
            Login below to get started.
          </p>

          {/* Alert Message Box */}
          {message.text && (
            <div className={`p-3 rounded-xl text-center text-sm font-medium mb-4 transition-all duration-300 ${
              message.type === "success" 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-red-100 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                placeholder="E-mail Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-300"
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
                className="w-full bg-slate-50 border border-gray-200 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input
                type="checkbox"
                id="remember"
                className="accent-orange-500"
              />
              <label htmlFor="remember">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white font-bold py-3 rounded-full transition"
            >
              Login
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            New User?{" "}
            <span className="text-rose-500 font-semibold cursor-pointer hover:underline">
              Register here
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;