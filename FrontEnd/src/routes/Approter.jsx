import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { FaThLarge, FaStore, FaBox, FaShoppingCart, FaUsers, FaStar, FaCog, FaBell, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { ProtectedRoute, AdminRoute } from "./ProtectedRoute";

// Boggaga Dukaanka Caadiga ah
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Navbar from "../components/Navbar";
import HomeProducts from "../pages/Products"; // Kii dukaanka macaamiisha
import NotFound from "../pages/NotFound";

// Boggaga maamulka Dashboard-ka
import Dashboard from "../components/Dashboard";
import AdminProducts from "../pages/AdminProducts"; // Kii maamulka
import Orders from "../pages/Orders";
import Users from "../pages/Users";
import Reviews from "../pages/Reviews";
import Settings from "../pages/Settings";

function Approter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 1. BOGAGGA FURAN (qof kastaa wuu arki karaa) */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/products" element={<><Navbar /><HomeProducts /></>} />
        <Route path="/about" element={<><Navbar /><About /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /></>} />
        <Route path="/login" element={<Login />} />

        {/* 2. BOG XIRAN: waa in aad LOGIN gashaa (ProtectedRoute) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Navbar />
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* 3. DASHBOARD: ADMIN kaliya (AdminRoute) */}
        <Route
          path="/dashboard/*"
          element={
            <AdminRoute>
              <SidebarLayout />
            </AdminRoute>
          }
        />

        {/* 4. Wax kasta oo kale -> 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

// ==========================================
// COMPONENT-KA SIDEBAR LAYOUT (SHOPHUB)
// ==========================================
function SidebarLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Xarfaha hore ee magaca (Avatar), tusaale "Axmed Cali" -> "AC"
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
      {/* SIDEBAR (BIDIX) */}
      <div className="w-64 bg-slate-950 text-slate-300 p-6 flex flex-col gap-8 border-r border-slate-900 shrink-0">
        <div className="text-2xl font-black text-white tracking-wider flex items-center gap-2 px-2">
          <FaStore className="text-blue-500" /> ShopHub
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {menus.map((m, i) => {
            const isActive = location.pathname === m.path;
            return (
              <Link
                key={i}
                to={m.path}
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

        {/* Logout hoosta sidebar-ka */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-slate-900 hover:text-red-300 transition-all"
        >
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>

      {/* NAV-KA SARE IYO CONTENT-KA BOGGA (MIDIG) */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white h-20 px-8 flex justify-between items-center border-b border-gray-100">
          <input
            type="text"
            placeholder="Search here..."
            className="bg-slate-50 border rounded-xl px-4 py-2 w-80 text-sm outline-none focus:border-blue-400"
          />
          <div className="flex items-center gap-6">
            <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-blue-600" />
            {/* User-ka DHABTA AH ee soo galay (kama imanayo qoraal go'an) */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {initials}
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-800">{user?.fullName}</p>
                <p className="text-gray-400">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Qaybta boggaga Dashboard-ka ee firfircoon */}
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
