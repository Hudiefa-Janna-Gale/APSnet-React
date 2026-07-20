import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../api";
import { useCart } from "../context/CartContext";

function FeaturedProducts() {
  const navigate = useNavigate();
  // GLOBAL STATE: addToCart waxaa laga helaa CartContext
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Scroll-triggered animation using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing after first trigger
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of section is visible
        rootMargin: "0px 0px -50px 0px", // Slightly delay trigger
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Alaabta waxaa laga soo akhriyaa API-ga (8-da ugu dambeysay)
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data.slice(0, 8)))
      .catch(() => setProducts([]));
  }, []);

  // Marka dukaanku cusub yahay oo alaab la'yahay, qaybtan waa la qariyaa
  if (products.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gray-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`flex justify-between items-end mb-12 transition-all duration-700 transform ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Products
            </h1>
            <div className="w-16 h-1 bg-blue-600 rounded-full mt-3"></div>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="group text-blue-600 font-semibold flex items-center gap-2 transition-all duration-300 hover:gap-4"
          >
            View All
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">
              →
            </span>
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.productID}
              className={`transition-all duration-700 transform ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              <ProductCard
                product={product}
                onAddToCart={addToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;