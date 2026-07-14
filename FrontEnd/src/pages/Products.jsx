import { useState, useEffect } from 'react';
import { FaShoppingCart, FaEye, FaHeart, FaSlidersH, FaSearch } from 'react-icons/fa';
import api from '../api';

// Bogga alaabta dukaanka: xogta waxay ka timaadaa API-ga backend-ka
const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Soo akhrisashada alaabta (iyo raadinta) API-ga
  // Marka searchTerm uu isbeddelo waxaan isticmaalnaa /products/search
  useEffect(() => {
    const timer = setTimeout(() => {
      const url = searchTerm.trim()
        ? `/products/search?name=${encodeURIComponent(searchTerm.trim())}`
        : '/products';

      api.get(url)
        .then((res) => {
          setProducts(res.data);
          setLoading(false);
          setError(null);
        })
        .catch(() => {
          setError('Could not load products. Is the API running?');
          setLoading(false);
        });
    }, 300); // debounce si aan API-ga loo qulqulin

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Qaybaha waxaa laga soo saaraa xogta dhabta ah
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // 2. Loading Skeleton
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-10 bg-gray-200 rounded-lg w-1/4 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 h-96 border border-gray-100 space-y-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-xl w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-full mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Error Handling
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md">
          <p className="text-red-500 font-semibold text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Products</h1>
            <p className="text-sm text-gray-500 mt-1">Discover our latest collection of premium items.</p>
          </div>

          {/* Search Box: waxay isticmaashaa /api/products/search */}
          <div className="relative w-full md:w-80">
            <FaSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mb-8">
          <div className="text-gray-400 p-2 bg-white border border-gray-200 rounded-xl shrink-0 md:block hidden">
            <FaSlidersH size={18} />
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition border ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Haddii raadintu waxba soo celin weydo */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg font-semibold">No products found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
          </div>
        )}

        {/* 4. PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.productID}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-white p-4 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
            >
              {/* Product Image & Hover Action Overlay */}
              <div className="relative bg-gray-50 rounded-xl p-6 h-52 flex items-center justify-center overflow-hidden mb-4">
                <img
                  src={product.imageURL || 'https://via.placeholder.com/300?text=No+Image'}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                />

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 rounded-full transition shadow-sm backdrop-blur-sm">
                  <FaHeart size={18} />
                </button>

                {/* Quick View Icon on Hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-3 bg-white text-gray-700 hover:bg-blue-600 hover:text-white rounded-full transition shadow-md transform translate-y-4 group-hover:translate-y-0 duration-300">
                    <FaEye size={18} />
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {product.category || 'Other'}
                  </span>

                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mt-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </div>

                {/* Stock & Price */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={`text-xs font-bold ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stockQuantity > 0 ? `In stock: ${product.stockQuantity}` : 'Out of stock'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-xl font-extrabold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      className="text-xs font-bold px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/10 transition flex items-center justify-center gap-1"
                    >
                      <FaShoppingCart size={14} /> ADD TO CART
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Products;
