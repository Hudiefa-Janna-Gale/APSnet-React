import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

function FeaturedProducts({ onAddToCart }) {
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

  const products = [
    {
      id: 1,
      title: "Smart Watch",
      price: "$99.99",
      badge: "New",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    },
    {
      id: 2,
      title: "Wireless Headphones",
      price: "$59.99",
      badge: "Sale",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    {
      id: 3,
      title: "DSLR Camera",
      price: "$499.99",
      badge: "Hot",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    },
    {
      id: 4,
      title: "Backpack",
      price: "$11.99",
      badge: "New",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    },
    {
      id: 5,
      title: "Smart Watch",
      price: "$99.99",
      badge: "New",
      image:
        "https://i.pinimg.com/736x/64/52/b7/6452b736b9d4962bc7fbdc16ef9b6329.jpg",
    },
    {
      id: 6,
      title: "Wireless Headphones",
      price: "$29",
      badge: "Sale",
      image:
        "https://i.pinimg.com/1200x/ec/9e/26/ec9e26a91dc9693507d48c5e399eeadb.jpg",
    },
    {
      id: 7,
      title: "DSLR Camera",
      price: "$89.9",
      badge: "Hot",
      image:
        "https://i.pinimg.com/1200x/d8/67/e2/d867e25416f27feca2d56e08b4ce7523.jpg",
    },
    {
      id: 8,
      title: "Backpack",
      price: "$19.99",
      badge: "New",
      image:
        "https://i.pinimg.com/1200x/d4/47/f7/d447f7423c6319e4603c40ea92d72330.jpg",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`flex justify-between items-center mb-12 transition-all duration-700 transform ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Featured Products
          </h1>

          <button className="group text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-2 transition-all duration-300 hover:gap-4">
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
              key={product.id}
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
                image={product.image}
                title={product.title}
                price={product.price}
                badge={product.badge}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;