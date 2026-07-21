import { useState, useEffect, useCallback } from "react";
import { FaTrash, FaLock } from "react-icons/fa";
import api from "../api";
import toast from "react-hot-toast";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      toast.error("Could not load users. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const deleteUser = async (u) => {
    if (!window.confirm(`Delete user "${u.fullName}"?`)) return;
    try {
      const res = await api.delete(`/users/${u.userID}`);
      toast.success(res.data.message);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen flex-1">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Registered Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <p className="text-gray-400">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          users.map((u) => (
            <div
              key={u.userID}
              className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                {u.fullName[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{u.fullName}</h3>
                <p className="text-xs text-gray-400">{u.email}</p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${
                    u.role === "Admin"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {u.role}
                </span>
              </div>

              {u.role === "Admin" ? (
                <span
                  className="p-2 text-gray-300"
                  title="Admin accounts are protected and cannot be deleted"
                >
                  <FaLock />
                </span>
              ) : (
                <button
                  onClick={() => deleteUser(u)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Delete user"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default Users;
