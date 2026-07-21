import { FaShoppingCart, FaImage } from "react-icons/fa";

function ProductCard({ product, onAddToCart }) {
  const inStock = product.stockQuantity > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

      <div className="relative bg-gray-50 h-52 flex items-center justify-center overflow-hidden">

        <span className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">
          {product.category || "New"}
        </span>

        {product.imageURL ? (
          <img
            src={product.imageURL}
            alt={product.name}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <FaImage className="text-5xl text-gray-200" />
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h2>

        {product.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4">
          <p className="text-lg font-extrabold text-slate-900">
            ${Number(product.price).toFixed(2)}
          </p>
          <span
            className={`text-[11px] font-bold ${
              inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            {inStock ? `In stock: ${product.stockQuantity}` : "Out of stock"}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={!inStock}
          className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300"
        >
          <FaShoppingCart />
          {inStock ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
