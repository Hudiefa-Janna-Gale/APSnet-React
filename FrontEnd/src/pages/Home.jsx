import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Features from "../components/Features";
import FeaturedProducts from "../components/FeaturedProducts";

// Props looma baahna: component kastaa wuxuu isticmaalaa context-ga
function Home() {
  return (
    <>
      <Hero />
      <Features />

      <FeaturedProducts />

      <Categories />
      <Footer />
    </>
  );
}

export default Home;
