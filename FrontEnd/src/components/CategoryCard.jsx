import { FaTags, FaArrowRight } from "react-icons/fa";

function CategoryCard({ image, title, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-100 p-6 text-center hover:-translate-y-2 hover:shadow-xl hover:border-blue-100 transition-all duration-300 w-full"
    >
      <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center bg-blue-50 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <FaTags className="text-4xl text-blue-300" />
        )}
      </div>

      <h2 className="text-xl font-extrabold mt-6 text-slate-800">{title}</h2>

      <p className="text-sm text-gray-400 mt-1">
        {count} {count === 1 ? "product" : "products"}
      </p>

      <span className="inline-flex items-center gap-2 mt-4 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
        Shop Now <FaArrowRight className="text-xs" />
      </span>
    </button>
  );
}

export default CategoryCard;
