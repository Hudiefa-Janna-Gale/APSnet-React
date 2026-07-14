import { useState, useEffect, useCallback } from "react";
import { FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import api from "../api";
import toast from "react-hot-toast";

// Bogga dalabaadka: liiska orders-ka dhabta ah ee API-ga,
// beddelka status-ka iyo tirtiridda.
const statusStyles = {
  Completed: "bg-green-100 text-green-600",
  Pending: "bg-amber-100 text-amber-600",
  Cancelled: "bg-red-100 text-red-600",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);

  const loadOrders = useCallback(async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch {
      toast.error("Could not load orders. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Muuji / qari alaabta dalabka (GET /api/orders/{id})
  const toggleItems = async (orderId) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    try {
      const res = await api.get(`/orders/${orderId}`);
      setExpandedItems(res.data.items);
      setExpandedId(orderId);
    } catch {
      toast.error("Could not load order items.");
    }
  };

  // PUT /api/orders/{id}/status
  const updateStatus = async (orderId, status) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status });
      toast.success(res.data.message);
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed.");
    }
  };

  // DELETE /api/orders/{id}
  const deleteOrder = async (orderId) => {
    if (!window.confirm(`Delete order #${orderId}?`)) return;
    try {
      const res = await api.delete(`/orders/${orderId}`);
      toast.success(res.data.message);
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen flex-1">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Orders List</h1>

      <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4">
        {loading ? (
          <p className="text-center text-gray-400 py-8">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No orders yet.</p>
        ) : (
          orders.map((o) => (
            <div key={o.orderID} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800">
                    #{o.orderID} - {o.customerName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {new Date(o.orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-bold text-slate-800">
                    ${Number(o.totalAmount).toFixed(2)}
                  </p>

                  {/* Status dropdown: PUT /api/orders/{id}/status */}
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.orderID, e.target.value)}
                    className={`text-xs px-3 py-1.5 rounded-full font-bold border-0 outline-none cursor-pointer ${
                      statusStyles[o.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => toggleItems(o.orderID)}
                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition"
                    title="View items"
                  >
                    {expandedId === o.orderID ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  <button
                    onClick={() => deleteOrder(o.orderID)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete order"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Alaabta dalabka (expandable) */}
              {expandedId === o.orderID && (
                <div className="mt-4 bg-slate-50 rounded-xl p-4 space-y-2">
                  {expandedItems.map((item) => (
                    <div
                      key={item.orderItemID}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-slate-700">
                        {item.productName}{" "}
                        <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="font-bold text-slate-800">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default Orders;
