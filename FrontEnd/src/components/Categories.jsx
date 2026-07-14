import CategoryCard from "./CategoryCard";

function Categories() {
  const categories = [
    {
      id: 1,
      image:
        "https://i.pinimg.com/736x/a5/50/3c/a5503cf5294eb4cc82805384fdfd4676.jpg",
      title: "Fashion",
      color: "bg-blue-100",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
      title: "Electronics",
      color: "bg-blue-100",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400",
      title: "Watches",
      color: "bg-blue-100",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      title: "Shoes",
      color: "bg-green-100",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-6xl font-bold text-center">
          Shop by Category
        </h1>

        <div className="w-24 h-1 bg-blue-600 mx-auto mt-5 rounded-full"></div>

        <p className="text-center text-gray-500 text-xl mt-6 mb-16">
          Explore our wide range of products across various categories
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              image={category.image}
              title={category.title}
              color={category.color}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;