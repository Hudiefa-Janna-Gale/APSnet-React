import { useState } from "react";
import Approter from "./routes/Approter";

function App() {
  const [cartItems, setCartItems] = useState([]);

  // 1. Alaab ku darista Cart-ka
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.title === product.title);
      if (exists) {
        return prev.map((item) =>
          item.title === product.title
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 2. Function-ka kordhinaya nambarka (+)
  const increaseQuantity = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  // 3. Function-ka dhimaya nambarka (-)
  const decreaseQuantity = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // 4. Function-ka alaabta ka saaraya Cart-ka (Trash)
  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // CUSBOONAYSIIN: Xisaabi tirada guud ee alaabta dambiisha ku jirta si Navbar-ku u tuso
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <Approter
      cartItems={cartItems}
      cartCount={cartCount} // Waxaan u baasnay tirada guud
      addToCart={addToCart}
      increaseQuantity={increaseQuantity}
      decreaseQuantity={decreaseQuantity}
      removeFromCart={removeFromCart}
    />
  );
}

export default App;