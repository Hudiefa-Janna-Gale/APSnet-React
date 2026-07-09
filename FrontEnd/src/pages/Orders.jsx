function Orders() {
  const orders = [
    { id: "#1234", customer: "Ali Mohamed", date: "May 24, 2026", total: "$120.00", status: "Completed" },
    { id: "#1235", customer: "Halima Ahmed", date: "May 23, 2026", total: "$310.00", status: "Pending" },
  ];
  return (
    <div className="p-8 bg-slate-50 min-h-screen flex-1">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Orders List</h1>
      <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4">
        {orders.map((o, idx) => (
          <div key={idx} className="flex justify-between items-center border-b pb-4 last:border-0">
            <div>
              <h3 className="font-bold text-slate-800">{o.id} - {o.customer}</h3>
              <p className="text-xs text-gray-400">{o.date}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800 mb-1">{o.total}</p>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${o.status === "Completed" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>{o.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Orders;