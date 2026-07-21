import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaShoppingBag } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../api";

const statusStyles = {
  Completed: "text-green-700 bg-green-50 border-green-200",
  Pending: "text-amber-700 bg-amber-50 border-amber-200",
  Cancelled: "text-red-700 bg-red-50 border-red-200",
};

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      setError(false);
      try {
        const res = await api.get("/orders/mine");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load my orders:", err);
        setError(true);
        toast.error(
          err.response?.data?.message || "Could not load your orders. Is the API running?"
        );
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-8">
          My Orders
        </h1>

        {loading && (
          <p className="text-gray-500">Loading your orders...</p>
        )}

        {error && !loading && (
          <div className="bg-red-50 text-red-700 px-5 py-4 rounded-xl">
            Could not load your orders. Please try again.
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <FaShoppingBag className="text-3xl text-blue-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-8">
              When you place an order it will show up here.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition"
            >
              Browse Products
            </button>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderID}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >

              <div className="flex flex-wrap justify-between items-center gap-3 px-6 py-4 border-b bg-slate-50">
                <div className="flex items-center gap-3">
                  <FaBoxOpen className="text-blue-500 text-lg" />
                  <div>
                    <p className="font-bold text-slate-800">Order #{order.orderID}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      statusStyles[order.status] || "text-slate-600 bg-slate-50 border-slate-200"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="divide-y">
                {(order.items || []).map((item) => (
                  <div
                    key={item.orderItemID}
                    className="flex justify-between items-center px-6 py-3 text-sm"
                  >
                    <div className="text-slate-700">
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-gray-400"> × {item.quantity}</span>
                    </div>
                    <span className="text-slate-600">
                      ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
