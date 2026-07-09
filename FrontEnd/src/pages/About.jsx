import React from 'react';
import { Target, Eye } from 'lucide-react';
import Navbar from "../components/Navbar";
import Approter from "../routes/Approter";
const About = () => {
  return (
    <>
   
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between font-sans">
      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Text Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">About Us</h1>
            <p className="text-lg font-medium text-gray-700">
              We are more than just an online store
            </p>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            ShopHub is your one-stop destination for all your shopping needs. 
            We offer high-quality products, excellent customer service, and fast delivery.
          </p>
          
          {/* Mission & Vision */}
          <div className="space-y-6 pt-4">
            {/* Our Mission */}
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600 shrink-0">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Our Mission</h3>
                <p className="text-gray-600">
                  To provide our customers with the best products and shopping experience.
                </p>
              </div>
            </div>

            {/* Our Vision */}
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600 shrink-0">
                <Eye size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Our Vision</h3>
                <p className="text-gray-600">
                  To become the most trusted online store in the world.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="w-full h-full flex justify-center md:justify-end">
          <img 
            src="https://i.pinimg.com/736x/9a/91/69/9a91693e48ceab169607be4e6b32d116.jpg" 
            alt="About Us Team" 
            className="rounded-tl-[60px] rounded-br-[60px] rounded-tr-lg rounded-bl-lg object-cover w-full max-w-md h-auto shadow-md"
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        {/* Stats Bar */}
        <div className="bg-[#0f2137] text-white py-10">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-1">10K+</h2>
              <p className="text-sm text-gray-400">Happy Customers</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-1">500+</h2>
              <p className="text-sm text-gray-400">Products</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-1">50+</h2>
              <p className="text-sm text-gray-400">Brands</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-1">99%</h2>
              <p className="text-sm text-gray-400">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Footer Label */}
        <div className="bg-gray-100 py-4 text-center">
          <span className="text-purple-700 font-bold tracking-wider text-sm uppercase">
            ABOUT PAGE
          </span>
        </div>
      </div>
    </div>
    </>
  );
};

export default About;