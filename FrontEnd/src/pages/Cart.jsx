import { useMemo } from "react";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaTag,
  FaShieldAlt,
  FaShoppingBag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    checkout,
  } = useCart();

  const subtotal = useMemo(() => {
    const total = cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      return total + price * item.quantity;
    }, 0);
    return total;
  }, [cartItems]);

  const discount = useMemo(() => {
    return subtotal * 0.1;
  }, [subtotal]);

  const shipping = useMemo(() => {
    return cartItems.length > 0 ? 50 : 0;
  }, [cartItems]);

  const total = useMemo(() => {
    return subtotal - discount + shipping;
  }, [subtotal, discount, shipping]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl p-4 sm:p-8 shadow-lg">

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-10">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">

            {cartItems.length > 0 && (
              <div className="hidden sm:grid grid-cols-4 font-semibold border-b pb-4">
                <p>Product</p>
                <p className="text-center">Quantity</p>
                <p className="text-center">Total</p>
                <p className="text-center">Action</p>
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-6">
                  <FaShoppingBag className="text-3xl text-blue-400" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-500 mb-8">
                  Looks like you haven't added anything yet.
                </p>
                <button
                  onClick={() => navigate("/products")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => {
                const price = Number(item.price) || 0;
                const totalPrice = price * item.quantity;

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-4 sm:gap-0 sm:grid sm:grid-cols-4 sm:items-center py-6 border-b hover:bg-gray-50 transition-colors"
                  >

                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;utf8,<svg xmlns='http:
                        }}
                      />
                      <div>
                        <h3 className="font-bold text-xl">
                          {item.title}
                        </h3>
                        <p className="text-gray-500">
                          {item.badge || 'In Stock'}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          ${price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
                        <button
                          onClick={() => decreaseQuantity && decreaseQuantity(index)}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus className={item.quantity <= 1 ? 'opacity-50' : ''} />
                        </button>
                        <span className="px-5 font-bold text-lg min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity && increaseQuantity(index)}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>

                    <div className="text-center text-2xl font-bold text-blue-600">
                      ${totalPrice.toFixed(2)}
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={() => removeFromCart && removeFromCart(index)}
                        className="text-red-500 hover:text-red-700 text-xl transition-colors duration-200 p-2 hover:bg-red-50 rounded-full"
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 h-fit shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>Order Summary</span>
              <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                {cartItems.length} items
              </span>
            </h2>

            <div className="flex mb-6">
              <div className="flex items-center border rounded-l-xl px-4 bg-white">
                <FaTag className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Coupon Code"
                className="border-t border-b flex-1 px-4 py-3 outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-5 rounded-r-xl hover:bg-blue-700 transition-colors">
                Apply
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-lg">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-green-600">
                <span>Discount (10%)</span>
                <span className="font-semibold">- ${discount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">${shipping.toFixed(2)}</span>
              </div>

              <hr className="my-4 border-gray-200" />

              <div className="flex justify-between items-center text-2xl font-bold">
                <span>Total</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => checkout && checkout()}
              className={`mt-8 w-full text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
                cartItems.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
              }`}
              disabled={cartItems.length === 0}
            >
              {cartItems.length === 0 ? 'Cart is Empty' : 'Proceed To Checkout'}
            </button>

            <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm">
              <FaShieldAlt />
              <span>Secure Checkout • SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
