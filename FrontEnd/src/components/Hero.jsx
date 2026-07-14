import React from "react";
import { FaStar, FaShoppingBag, FaTruck, FaLock } from "react-icons/fa";

function Hero() {
  return (
    <section className="relative bg-gradient-to-tr from-slate-900 via-blue-950 to-blue-950 min-h-[95vh] flex items-center overflow-hidden w-full selection:bg-blue-500 selection:text-white">
      
      {/* 1. BACKGROUND EFFECTS (Nuruqa dynamic ah iyo dhibco dhex sabaynaya) */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 to-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 to-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]"></div>
      
      {/* Dhibco yaryar oo sabaynaya (Floating Particles) */}
      <div className="absolute top-1/4 left-1/2 w-3 h-3 bg-blue-400 rounded-full blur-sm opacity-60 animate-[bounce_5s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-blue-400 rounded-full blur-sm opacity-40 animate-[bounce_7s_ease-in-out_infinite_1s]"></div>
      <div className="absolute top-1/3 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-50 animate-ping duration-[3000ms]"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center relative z-10 w-full py-16">

        {/* ==================== QAYBTA BIDIX (CONTENT) ==================== */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8 max-w-xl">
          
          {/* Glowing Badge */}
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-blue-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider shadow-[0_0_15px_rgba(0,87,255,0.2)] hover:bg-white/15 transition-all duration-300 cursor-pointer">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <FaStar className="text-blue-300" /> NEW COLLECTION 2026
          </span>

          {/* Premium Typography */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
            Discover
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 drop-shadow-sm">
              Amazing
            </span>
            <br />
            Products
          </h1>

          {/* Description */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
            Elevate your lifestyle. Shop the absolute latest in luxury fashion, 
            cutting-edge electronics, and modern accessories with guaranteed best prices.
          </p>

          {/* Interactive Buttons */}
          <div className="flex flex-wrap gap-4 w-full justify-center md:justify-start pt-2">
            <button className="relative group bg-gradient-to-r from-blue-600 to-blue-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/40 hover:shadow-blue-600/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></span>
              <span className="relative flex items-center gap-2">
                <FaShoppingBag /> Shop Now
              </span>
            </button>

            <button className="bg-white/5 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl backdrop-blur-md hover:bg-white/10 hover:border-blue-500/50 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-lg">
              Learn More
            </button>
          </div>

          {/* Trust Badges (Faa'iidooyinka Dukaanka oo Fudud) */}
          <div className="flex items-center gap-6 pt-6 border-t border-white/10 w-full justify-center md:justify-start text-xs text-slate-400 font-medium tracking-wide">
            <div className="flex items-center gap-2"><FaTruck className="text-blue-400" /> Fast Delivery</div>
            <div className="flex items-center gap-2"><FaLock className="text-blue-400" /> Secure Payment</div>
            <div className="flex items-center gap-2"><FaStar className="text-blue-400" /> 4.9/5 Rating</div>
          </div>

        </div>

        {/* ==================== QAYBTA MIDIG (IMAGE) ==================== */}
        <div className="flex justify-center items-center relative w-full">
          
          {/* Gadaasha sawirka (Glowing Aura Loop) */}
          <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-blue-500/10 to-blue-500/10 rounded-full blur-2xl animate-[pulse_4s_ease-in-out_infinite]"></div>
          
          {/* Rotating Ring */}
          <div className="absolute w-[90%] h-[90%] border border-dashed border-white/10 rounded-full animate-[spin_40s_linear_infinite] pointer-events-none"></div>
          
          {/* Main Floating Container */}
          <div className="relative p-6 animate-[bounce_5s_ease-in-out_infinite] hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
            {/* Glassmorphism Card ka dambeeya sawirka */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 transform rotate-3 scale-95 -z-10 shadow-2xl"></div>
            
            <img
              src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png"
              alt="Premium E-commerce Illustration"
              className="w-full max-w-sm sm:max-w-md drop-shadow-[0_30px_50px_rgba(0,87,255,0.25)]"
            />
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;