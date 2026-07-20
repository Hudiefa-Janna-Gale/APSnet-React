import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import api from "../api";

// Qaybaha (categories) kama imanayaan qoraal go'an (mock) —
// waxaa laga soo saaraa alaabta DHABTA AH ee dukaanka ku jirta.
function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        // U kala saar alaabta category ahaan: magac + tiro + sawirka 1aad
        const grouped = {};
        for (const p of res.data) {
          const name = p.category || "Other";
          if (!grouped[name]) grouped[name] = { title: name, count: 0, image: null };
          grouped[name].count += 1;
          if (!grouped[name].image && p.imageURL) grouped[name].image = p.imageURL;
        }
        setCategories(Object.values(grouped).slice(0, 4));
      })
      .catch(() => setCategories([]));
  }, []);

  // Dukaan cusub oo alaab la'aan: qaybtan waa la qariyaa
  if (categories.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-slate-900 tracking-tight">
          Shop by Category
        </h1>

        <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>

        <p className="text-center text-gray-500 text-base sm:text-lg mt-5 mb-14">
          Explore our range of products across every category in the store.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              image={category.image}
              title={category.title}
              count={category.count}
              onClick={() => navigate("/products")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
