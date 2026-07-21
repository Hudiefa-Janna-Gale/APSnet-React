import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const initialState = {
  items: [],
};

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

  const loadCart = useCallback(async () => {
    try {
      const res = await api.get(`/cart`);

      dispatch({
        type: "SET_CART",
        payload: res.data.map((c) => ({
          ...c,
          title: c.productName,
          image: c.imageURL,
        })),
      });
    } catch (err) {

      console.error("Failed to load cart:", err);
      dispatch({ type: "CLEAR_CART" });
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      dispatch({ type: "CLEAR_CART" });
    }
  }, [user, loadCart]);

  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please login first to add products to your cart.");
      return;
    }
    try {
      await api.post("/cart", {
        productID: product.productID,
        quantity: 1,
      });
      await loadCart();
      toast.success(`${product.name} added to cart.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart.");
    }
  };

  const increaseQuantity = async (index) => {
    const item = state.items[index];
    try {
      await api.put(`/cart/${item.cartID}`, { quantity: item.quantity + 1 });
      await loadCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update quantity.");
    }
  };

  const decreaseQuantity = async (index) => {
    const item = state.items[index];
    if (item.quantity <= 1) return;
    try {
      await api.put(`/cart/${item.cartID}`, { quantity: item.quantity - 1 });
      await loadCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update quantity.");
    }
  };

  const removeFromCart = async (index) => {
    const item = state.items[index];
    try {
      await api.delete(`/cart/${item.cartID}`);
      await loadCart();
      toast.success("Item removed from cart.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove item.");
    }
  };

  const checkout = async () => {
    if (!user) {
      toast.error("Please login first.");
      return;
    }
    try {
      const res = await api.post(`/orders/checkout`);
      toast.success(
        `${res.data.message} Order #${res.data.orderId} — Total: $${res.data.totalAmount}`
      );
      await loadCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed.");
    }
  };

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

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
