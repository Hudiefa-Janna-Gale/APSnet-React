import { Link } from "react-router-dom";
import { FaStore, FaFacebookF, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <FaStore />
            </span>
            <span className="text-xl font-extrabold text-white">
              Shop<span className="text-blue-400">Hub</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            Your one-stop shop for fashion, electronics and more — quality
            products, fair prices and fast delivery.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {[FaFacebookF, FaTwitter, FaInstagram, FaEnvelope].map((Icon, i) => (
              <span
                key={i}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center cursor-pointer transition"
              >
                <Icon className="text-sm" />
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-bold mb-4 text-sm tracking-wider uppercase">Shop</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/products" className="hover:text-blue-400 transition">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-blue-400 transition">My Cart</Link></li>
            <li><Link to="/login" className="hover:text-blue-400 transition">My Account</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4 text-sm tracking-wider uppercase">Company</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-slate-500">
        © 2026 ShopHub. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
