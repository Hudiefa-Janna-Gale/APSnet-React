import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { FaThLarge, FaStore, FaBox, FaShoppingCart, FaUsers, FaStar, FaCog, FaBell, FaSignOutAlt, FaHome, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { ProtectedRoute, AdminRoute } from "./ProtectedRoute";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Navbar from "../components/Navbar";
import HomeProducts from "../pages/Products";
import MyOrders from "../pages/MyOrders";
import NotFound from "../pages/NotFound";

import Dashboard from "../components/Dashboard";
import AdminProducts from "../pages/AdminProducts";
import Orders from "../pages/Orders";
import Users from "../pages/Users";
import Reviews from "../pages/Reviews";
import Settings from "../pages/Settings";

function Approter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/products" element={<><Navbar /><HomeProducts /></>} />
        <Route path="/about" element={<><Navbar /><About /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /></>} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Navbar />
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Navbar />
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <AdminRoute>
              <SidebarLayout />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

function SidebarLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = (user?.fullName || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: <FaThLarge /> },
    { name: "Products", path: "/dashboard/products", icon: <FaBox /> },
    { name: "Orders", path: "/dashboard/orders", icon: <FaShoppingCart /> },
    { name: "Users", path: "/dashboard/users", icon: <FaUsers /> },
    { name: "Reviews", path: "/dashboard/reviews", icon: <FaStar /> },
    { name: "Settings", path: "/dashboard/settings", icon: <FaCog /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 w-full">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 p-6 flex flex-col gap-8 border-r border-slate-900 shrink-0 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="text-2xl font-black text-white tracking-wider flex items-center justify-between px-2">
          <span className="flex items-center gap-2">
            <FaStore className="text-blue-500" /> ShopHub
          </span>
          <button
            onClick={closeSidebar}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {menus.map((m, i) => {
            const isActive = location.pathname === m.path;
            return (
              <Link
                key={i}
                to={m.path}
                onClick={closeSidebar}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                {m.icon} <span>{m.name}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          to="/"
          onClick={closeSidebar}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
        >
          <FaHome /> <span>Back to Home</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-slate-900 hover:text-red-300 transition-all"
        >
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white h-20 px-4 sm:px-8 flex justify-between items-center border-b border-gray-100 gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">

            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-blue-600 text-xl shrink-0"
            >
              <FaBars />
            </button>
            <input
              type="text"
              placeholder="Search here..."
              className="hidden sm:block bg-slate-50 border rounded-xl px-4 py-2 w-full max-w-xs text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-blue-600" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {initials}
              </div>
              <div className="text-left text-xs hidden sm:block">
                <p className="font-bold text-slate-800">{user?.fullName}</p>
                <p className="text-gray-400">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Approter;
