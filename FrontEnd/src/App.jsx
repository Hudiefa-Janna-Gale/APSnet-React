import { useState, useEffect, useCallback } from "react";
import Approter from "./routes/Approter";
import api from "./api";
import toast from "react-hot-toast";

function App() {
  const [cartItems, setCartItems] = useState([]);

  // User-ka hadda gudaha jira (waxaa lagu keydiyaa localStorage)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("shopUser");
    return saved ? JSON.parse(saved) : null;
  });

  // Cart-ka waxaa laga soo akhriyaa database-ka (API-ga)
  const loadCart = useCallback(async (userId) => {
    try {
      const res = await api.get(`/cart/user/${userId}`);
      // U beddel qaabka ay Cart.jsx sugayso (title, image, ...)
      setCartItems(
        res.data.map((c) => ({
          ...c,
          title: c.productName,
          image: c.imageURL,
        }))
      );
    } catch {
      setCartItems([]);
    }
  }, []);

  // Marka user-ku soo galo, soo rar cart-kiisa
  useEffect(() => {
    if (user) {
      loadCart(user.userID);
    } else {
      setCartItems([]);
    }
  }, [user, loadCart]);

  // 1. Alaab ku darista Cart-ka (POST /api/cart)
  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please login first to add products to your cart.");
      return;
    }
    try {
      await api.post("/cart", {
        userID: user.userID,
        productID: product.productID,
        quantity: 1,
      });
      await loadCart(user.userID);
      toast.success(`${product.name} added to cart.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart.");
    }
  };

  // 2. Kordhinta nambarka (+)  (PUT /api/cart/{cartId})
  const increaseQuantity = async (index) => {
    const item = cartItems[index];
    try {
      await api.put(`/cart/${item.cartID}`, { quantity: item.quantity + 1 });
      await loadCart(user.userID);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update quantity.");
    }
  };

  // 3. Dhimista nambarka (-)
  const decreaseQuantity = async (index) => {
    const item = cartItems[index];
    if (item.quantity <= 1) return;
    try {
      await api.put(`/cart/${item.cartID}`, { quantity: item.quantity - 1 });
      await loadCart(user.userID);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update quantity.");
    }
  };

  // 4. Alaabta ka saarista Cart-ka (DELETE /api/cart/{cartId})
  const removeFromCart = async (index) => {
    const item = cartItems[index];
    try {
      await api.delete(`/cart/${item.cartID}`);
      await loadCart(user.userID);
      toast.success("Item removed from cart.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove item.");
    }
  };

  // 5. Checkout: cart-ka ka dhig order dhab ah (POST /api/orders/checkout/{userId})
  const checkout = async () => {
    if (!user) {
      toast.error("Please login first.");
      return;
    }
    try {
      const res = await api.post(`/orders/checkout/${user.userID}`);
      toast.success(
        `${res.data.message} Order #${res.data.orderId} — Total: $${res.data.totalAmount}`
      );
      await loadCart(user.userID);
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed.");
    }
  };

  // Login / Logout
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("shopUser", JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("shopUser");
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <Approter
      cartItems={cartItems}
      cartCount={cartCount}
      addToCart={addToCart}
      increaseQuantity={increaseQuantity}
      decreaseQuantity={decreaseQuantity}
      removeFromCart={removeFromCart}
      checkout={checkout}
      user={user}
      onLogin={handleLogin}
      onLogout={handleLogout}
    />
  );
}

export default App;
