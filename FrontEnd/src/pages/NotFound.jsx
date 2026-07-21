import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-8 text-center">
      <div className="w-20 h-20 rounded-2xl bg-blue-600/20 flex items-center justify-center mb-6">
        <FaExclamationTriangle className="text-3xl text-blue-400" />
      </div>
      <h1 className="text-6xl font-black tracking-tight">404</h1>
      <p className="text-xl font-semibold mt-2">Page not found</p>
      <p className="text-slate-400 mt-2 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition"
      >
        Back to Home
      </button>
    </div>
  );
}

export default NotFound;
