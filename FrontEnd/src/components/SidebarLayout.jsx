import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FaThLarge, FaStore, FaBox, FaShoppingCart, FaUsers, FaStar, FaCog, FaBell } from "react-icons/fa";

// ========================================================
// 1. SOO JIIDASHADA BOGGAGA (KALIYA HAL JEER AYAA LA IMPORT GARAYNAYAA)
// ========================================================
import Dashboard from "../components/Dashboard";
import AdminProducts from "../pages/AdminProducts";
import Orders from "../pages/Orders";
import Users from "../pages/Users";
import Reviews from "../pages/Reviews";
import Settings from "../pages/Settings";

// ========================================================
// 2. COMPONENT-KA SIDEBAR LAYOUT
// ========================================================
export default function SidebarLayout() {
  const location = useLocation();

  // Categories halkan waa laga saaray si aysan u soo bixin menu-yada dhanka bidix
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
      </div>

      {/* NAV-KA SARE IYO CONTENT-KA BOGGA (MIDIG) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white h-20 px-8 flex justify-between items-center border-b border-gray-100">
          <input 
            type="text" 
            placeholder="Search here..." 
            className="bg-slate-50 border rounded-xl px-4 py-2 w-80 text-sm outline-none focus:border-blue-400" 
          />
          <div className="flex items-center gap-6">
            <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-blue-600" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">JD</div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-800">John Doe</p>
                <p className="text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Pages Area */}
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