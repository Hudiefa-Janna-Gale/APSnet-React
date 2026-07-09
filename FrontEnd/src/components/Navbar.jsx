import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaStore } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

function Navbar({ cartCount }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <FaStore className="text-3xl text-purple-500" />
          <h1 className="text-3xl font-bold text-purple-500">
            ShopHub
          </h1>
        </div>

        {/* Navigation */}
        <ul className="flex items-center gap-8 text-lg">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          <li><NavLink to="/products">Products</NavLink></li>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-5 text-2xl">

          <IoSearch className="cursor-pointer hover:text-purple-400 transition" />

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart className="hover:text-purple-400 transition" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </div>

          {/* User Icon oo isna tagaya login-ka markii la gujiyo */}
          <FaUserCircle 
            className="cursor-pointer hover:text-purple-400 transition" 
            onClick={() => navigate("/login")}
          />

          {/* Button-ka Login-ka oo lagu xiray page-ka login */}
          <button 
            onClick={() => navigate("/login")}
            className="bg-purple-500 text-base px-4 py-1.5 rounded-md hover:bg-purple-600 font-medium transition"
          >
            Login
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;