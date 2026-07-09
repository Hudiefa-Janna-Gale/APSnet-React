function Productse() {
  const products = [
    { id: 1, name: "Wireless Headphones", category: "Electronics", price: "$99.00", stock: "45 In Stock" },
    { id: 2, name: "Running Shoes", category: "Fashion", price: "$75.00", stock: "12 In Stock" },
  ];
  return (
    <div className="p-8 bg-slate-50 min-h-screen flex-1">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Products Management</h1>
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-sm">
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">{p.name}</td>
                <td className="p-4 text-gray-500">{p.category}</td>
                <td className="p-4 font-semibold text-purple-600">{p.price}</td>
                <td className="p-4 text-gray-600">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Productse;