function Users() {
  const users = [
    { name: "John Doe", email: "john@example.com", role: "Admin" },
    { name: "Aisha Omar", email: "aisha@example.com", role: "Customer" },
  ];
  return (
    <div className="p-8 bg-slate-50 min-h-screen flex-1">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Registered Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((u, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">{u.name[0]}</div>
            <div>
              <h3 className="font-bold text-slate-800">{u.name}</h3>
              <p className="text-xs text-gray-400">{u.email}</p>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded mt-1 inline-block">{u.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Users;