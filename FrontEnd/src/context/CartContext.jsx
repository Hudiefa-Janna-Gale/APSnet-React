import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

// ==============================================================
// CART CONTEXT + REDUCER  (Global State Management)
// --------------------------------------------------------------
// Cart-ka oo dhan hal meel ayaa laga maamulaa: component kasta
// wuxuu isticmaalaa `useCart()` si uu u helo alaabta iyo functions-ka.
// ==============================================================

const CartContext = createContext(null);

const initialState = {
  items: [], // alaabta cart-ka ku jirta
};

// REDUCER: hal action ayaa jira maxaa yeelay xogta runta ah
// waxay ku jirtaa database-ka; API-ga ka dib waan soo cusboonaysiinaa.
function cartReducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Cart-ka waxaa laga soo akhriyaa database-ka (API-ga)
  const loadCart = useCallback(async (userId) => {
    try {
      const res = await api.get(`/cart/user/${userId}`);
      // U beddel qaabka ay Cart.jsx sugayso (title, image, ...)
      dispatch({
        type: "SET_CART",
        payload: res.data.map((c) => ({
          ...c,
          title: c.productName,
          image: c.imageURL,
        })),
      });
    } catch {
      dispatch({ type: "CLEAR_CART" });
    }
  }, []);

  // Marka user-ku soo galo, soo rar cart-kiisa; marka uu baxo, faaruji
  useEffect(() => {
    if (user) {
      loadCart(user.userID);
    } else {
      dispatch({ type: "CLEAR_CART" });
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
    const item = state.items[index];
    try {
      await api.put(`/cart/${item.cartID}`, { quantity: item.quantity + 1 });
      await loadCart(user.userID);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update quantity.");
    }
  };

  // 3. Dhimista nambarka (-)
  const decreaseQuantity = async (index) => {
    const item = state.items[index];
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
    const item = state.items[index];
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

  // Tirada guud ee badge-ka Navbar-ka
  const cartCount = state.items.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        cartCount,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// CUSTOM HOOK: `useCart()` ayaa laga isticmaalaa component kasta
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
