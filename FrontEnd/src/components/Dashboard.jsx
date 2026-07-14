import { useState, useEffect } from "react";
import { FaShoppingBag, FaShoppingCart, FaUsers, FaDollarSign, FaRegHandPaper } from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from "recharts";
import api from "../api";

// Dashboard-ka: dhammaan tirooyinka waxay ka imanayaan API-ga (reports + orders)
const statusColors = {
  Completed: "text-green-600 bg-green-50",
  Pending: "text-amber-600 bg-amber-50",
  Cancelled: "text-red-600 bg-red-50",
};

function Dashboard() {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
  });
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // GET /api/reports/summary -> kaararka kore
    api.get("/reports/summary")
      .then((res) => setSummary(res.data))
      .catch(() => {});

    // GET /api/reports/sales-by-category -> chart-ka
    api.get("/reports/sales-by-category")
      .then((res) => setSalesByCategory(res.data))
      .catch(() => {});

    // GET /api/orders -> dalabaadka ugu dambeeyay
    api.get("/orders")
      .then((res) => setRecentOrders(res.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="p-8 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Welcome back <FaRegHandPaper className="text-blue-600" />
          </h1>
          <p className="text-gray-500 mt-2">
            Here's what's happening with your store today.
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-lg shadow-sm">
          {today}
        </div>
      </div>

      {/* Cards: xogta /api/reports/summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Products"
          value={summary.totalProducts}
          icon={<FaShoppingBag />}
          color="text-blue-600 bg-blue-50"
        />
        <Card
          title="Total Orders"
          value={summary.totalOrders}
          icon={<FaShoppingCart />}
          color="text-blue-500 bg-blue-100"
        />
        <Card
          title="Customers"
          value={summary.totalUsers}
          icon={<FaUsers />}
          color="text-blue-600 bg-blue-50"
        />
        <Card
          title="Revenue"
          value={`$${Number(summary.totalSales).toFixed(2)}`}
          icon={<FaDollarSign />}
          color="text-white bg-blue-600"
        />
      </div>

      {/* Chart + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

        {/* Chart: xogta /api/reports/sales-by-category */}
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold mb-5">
            Sales by Category
          </h2>

          <div className="h-72">
            {salesByCategory.length === 0 ? (
              <p className="text-gray-400 text-sm">No sales data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByCategory}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
                  <Bar dataKey="sales" fill="#0057FF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent orders: xogta /api/orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-5">
            Recent Orders
          </h2>

          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm">No orders yet.</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.orderID}
                className="flex justify-between items-center py-4 border-b"
              >
                <div>
                  <h3 className="font-bold">#{order.orderID}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    ${Number(order.totalAmount).toFixed(2)}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      statusColors[order.status] || "text-slate-600 bg-slate-50"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function Card({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between">
        <span className="text-gray-500 font-medium">{title}</span>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
      <h2 className="text-3xl font-bold mt-5">{value}</h2>
    </div>
  );
}

export default Dashboard;
