import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";

function ProductCard({
  image,
  title,
  price,
  badge,
  onAddToCart,
}) {
  // Product-ka waxaa loo dirayaa Cart-ka
  const product = {
    image,
    title,
    price,
    badge,
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-2xl transition duration-300">

      {/* Image */}
      <div className="relative bg-gray-100 p-6 overflow-hidden">

        {/* Badge */}
        <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
          {badge}
        </span>

        {/* Favorite */}
        <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:text-red-500 transition">
          <FaHeart />
        </button>

        {/* Product Image */}
        <img
          src={image}
          alt={title}
          className="w-40 h-40 mx-auto object-contain transition duration-300 group-hover:scale-110"
        />

      </div>

      {/* Content */}
      <div className="p-5">

        <h2 className="font-semibold text-lg">
          {title}
        </h2>

        <p className="text-purple-600 font-bold mt-2">
          {price}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-400 mt-3">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
        </div>

        {/* Add To Cart */}
        <button
          onClick={() => onAddToCart(product)}
          className="mt-5 w-full bg-purple-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition duration-300"
        >
          <FaShoppingCart />
          Add to Cart
        </button>

      </div>

    </div>
  );
}

export default ProductCard;