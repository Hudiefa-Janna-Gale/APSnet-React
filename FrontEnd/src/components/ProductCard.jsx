import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";

// Waxaa loo dhiibaa product dhab ah oo ka yimid API-ga
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-2xl transition duration-300">

      {/* Image */}
      <div className="relative bg-gray-100 p-6 overflow-hidden">

        {/* Badge: category-ga alaabta */}
        <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
          {product.category || "New"}
        </span>

        {/* Favorite */}
        <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:text-red-500 transition">
          <FaHeart />
        </button>

        {/* Product Image */}
        <img
          src={product.imageURL || "https://via.placeholder.com/300?text=No+Image"}
          alt={product.name}
          className="w-40 h-40 mx-auto object-contain transition duration-300 group-hover:scale-110"
        />

      </div>

      {/* Content */}
      <div className="p-5">

        <h2 className="font-semibold text-lg">
          {product.name}
        </h2>

        <p className="text-blue-600 font-bold mt-2">
          ${Number(product.price).toFixed(2)}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 text-blue-500 mt-3">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
        </div>

        {/* Add To Cart */}
        <button
          onClick={() => onAddToCart(product)}
          className="mt-5 w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition duration-300"
        >
          <FaShoppingCart />
          Add to Cart
        </button>

      </div>

    </div>
  );
}

export default ProductCard;
