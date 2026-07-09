import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Features from "../components/Features";
import FeaturedProducts from "../components/FeaturedProducts";

function Home({ addToCart }) {
  return (
    <>
      <Hero />
      <Features />

      <FeaturedProducts onAddToCart={addToCart} />

      <Categories />
      <Footer />
    </>
  );
}

export default Home;