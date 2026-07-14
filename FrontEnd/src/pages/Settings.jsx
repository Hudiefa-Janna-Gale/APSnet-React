function Settings() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen flex-1">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Store Settings</h1>
      <div className="bg-white p-6 rounded-3xl border shadow-sm max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Store Name</label>
          <input type="text" defaultValue="ShopHub" className="w-full p-3 border rounded-xl outline-none focus:border-blue-600 bg-slate-50" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Currency</label>
          <input type="text" defaultValue="USD ($)" className="w-full p-3 border rounded-xl outline-none focus:border-blue-600 bg-slate-50" />
        </div>
        <button className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}
export default Settings;