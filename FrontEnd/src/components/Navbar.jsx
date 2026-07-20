import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUserCircle,
  FaStore,
  FaThLarge,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();

  // GLOBAL STATE: props looma baahna — context ayaa laga soo akhriyaa
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  // NavLink wuxuu na siiyaa isActive si link-ka hadda furan u iftiimo
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition ${
      isActive
        ? "bg-white/10 text-white"
        : "text-slate-300 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => navigate("/")}
        >
          <span className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <FaStore className="text-lg" />
          </span>
          <h1 className="text-xl font-extrabold tracking-tight">
            Shop<span className="text-blue-400">Hub</span>
          </h1>
        </div>

        {/* Desktop navigation */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === "/"} className={linkClass}>
                {l.label}
              </NavLink>
            </li>
          ))}

          {/* AUTHORIZATION: link-kan waxaa arka ADMIN kaliya */}
          {isAdmin && (
            <li>
              <NavLink
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-blue-300 hover:text-blue-200 hover:bg-white/5 transition"
              >
                <FaThLarge /> Dashboard
              </NavLink>
            </li>
          )}
        </ul>

        {/* Right side: cart + user */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2.5 rounded-full hover:bg-white/10 transition"
            title="Shopping cart"
          >
            <FaShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Haddii user-ku soo galay: magaciisa + Logout. Haddii kale: Login */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-full pl-3 pr-1.5 py-1.5">
              <FaUserCircle className="text-blue-400 text-lg" />
              <span className="text-sm font-medium text-slate-200 max-w-[10rem] truncate">
                {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-full bg-slate-800 hover:bg-red-500/80 transition text-sm"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:block bg-blue-600 hover:bg-blue-500 text-sm px-5 py-2 rounded-full font-semibold transition"
            >
              Login
            </button>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-full hover:bg-white/10 transition"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 px-4 py-4 space-y-1 bg-slate-900">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/5"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-blue-300 hover:bg-white/5"
            >
              Dashboard
            </NavLink>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-white/5"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white text-center"
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
