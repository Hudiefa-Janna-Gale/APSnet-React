function CategoryCard({ image, title, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">

      <div
        className={`${color} w-56 h-56 rounded-full mx-auto flex items-center justify-center`}
      >
        <img
          src={image}
          alt={title}
          className="w-40 h-40 object-contain"
        />
      </div>

      <h2 className="text-3xl font-bold mt-8">
        {title}
      </h2>

      <button className="mt-6 text-purple-600 font-semibold text-xl hover:underline">
        Shop Now →
      </button>

    </div>
  );
}

export default CategoryCard;