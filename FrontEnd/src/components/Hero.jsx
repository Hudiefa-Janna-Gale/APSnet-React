import { FaStar, FaShoppingBag, FaTruck, FaLock, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/image/heroImage.jpg";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 min-h-[85vh] flex items-center overflow-hidden w-full selection:bg-white selection:text-blue-600">

      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-white/5 rounded-full pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-white/30 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-white/20 rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-14 items-center relative z-10 w-full py-16">

        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-7 max-w-xl">

          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider backdrop-blur-sm">
            <FaStar className="text-yellow-300" /> NEW COLLECTION 2026
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
            Everything you love,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-100">
              in one place.
            </span>
          </h1>

          <p className="text-blue-100 text-base sm:text-lg leading-relaxed font-light">
            Shop the latest fashion, electronics and accessories — fresh
            products added by our store every day, delivered fast to your door.
          </p>

          <div className="flex flex-wrap gap-4 w-full justify-center md:justify-start pt-1">
            <button
              onClick={() => navigate("/products")}
              className="group bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/20 hover:bg-blue-50 hover:scale-[1.03] active:scale-95 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <FaShoppingBag /> Shop Now
                <FaArrowRight className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </span>
            </button>

            <button
              onClick={() => navigate("/about")}
              className="bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 hover:scale-[1.03] active:scale-95 transition-all duration-300 backdrop-blur-sm"
            >
              Learn More
            </button>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-white/15 w-full justify-center md:justify-start text-xs text-blue-100 font-medium tracking-wide">
            <div className="flex items-center gap-2"><FaTruck className="text-white" /> Fast Delivery</div>
            <div className="flex items-center gap-2"><FaLock className="text-white" /> Secure Payment</div>
            <div className="flex items-center gap-2"><FaStar className="text-white" /> 4.9/5 Rating</div>
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center relative w-full">
          <div className="relative">

            <div className="absolute inset-0 bg-sky-400/30 blur-3xl rounded-full scale-90"></div>

            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-950/40 border-4 border-white/10 hover:scale-[1.02] transition-transform duration-500">
              <img
                src={heroImage}
                alt="ShopHub shopping experience"
                className="w-full max-w-lg h-[420px] object-cover"
              />

              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-2xl px-5 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">This week</p>
                  <p className="text-sm font-extrabold text-slate-800">New arrivals in store</p>
                </div>
                <button
                  onClick={() => navigate("/products")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
