import { useState, useEffect, useCallback, useRef } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaCloudUploadAlt,
  FaSpinner,
} from "react-icons/fa";
import api from "../api";
import toast from "react-hot-toast";

// Bogga maamulka alaabta: CRUD dhamaystiran (Create, Read, Update, Delete)
// oo dhan wuxuu la hadlayaa API-ga backend-ka.
// Sawir-badal (placeholder) gudaha ah — internet uma baahna
const NO_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='48' height='48' fill='%23f1f5f9'/></svg>";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  category: "",
  imageURL: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state: haddii editingId != null waa UPDATE, haddii kale waa CREATE
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // IMAGE UPLOAD: sawirka waxaa la geeyaa Cloudinary (POST /api/upload),
  // URL-ka soo noqda ayaa lagu keydiyaa form.imageURL
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await api.post("/upload", formData);
      setForm((f) => ({ ...f, imageURL: res.data.imageUrl }));
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
      // Reset so the same file can be picked again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Fariimaha waxaa lagu muujiyaa toast (react-hot-toast)
  const showMessage = (text, type) =>
    type === "success" ? toast.success(text) : toast.error(text);

  // READ: soo akhri alaabta (ama raadi magac)
  const loadProducts = useCallback(async (term = "") => {
    try {
      const url = term.trim()
        ? `/products/search?name=${encodeURIComponent(term.trim())}`
        : "/products";
      const res = await api.get(url);
      setProducts(res.data);
    } catch {
      showMessage("Could not load products. Is the API running?", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadProducts(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, loadProducts]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (p) => {
    setEditingId(p.productID);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      stockQuantity: p.stockQuantity,
      category: p.category || "",
      imageURL: p.imageURL || "",
    });
    setShowForm(true);
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Client side validation ---
    if (!form.name.trim()) return showMessage("Product name is required.", "error");
    if (!form.price || Number(form.price) <= 0)
      return showMessage("Price must be greater than zero.", "error");
    if (form.stockQuantity === "" || Number(form.stockQuantity) < 0)
      return showMessage("Stock quantity cannot be negative.", "error");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      category: form.category.trim() || null,
      imageURL: form.imageURL.trim() || null,
    };

    try {
      if (editingId) {
        const res = await api.put(`/products/${editingId}`, payload);
        showMessage(res.data.message, "success");
      } else {
        const res = await api.post("/products", payload);
        showMessage(res.data.message, "success");
      }
      setShowForm(false);
      loadProducts(searchTerm);
    } catch (err) {
      showMessage(err.response?.data?.message || "Save failed.", "error");
    }
  };

  // DELETE
  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      const res = await api.delete(`/products/${p.productID}`);
      showMessage(res.data.message, "success");
      loadProducts(searchTerm);
    } catch (err) {
      showMessage(err.response?.data?.message || "Delete failed.", "error");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen flex-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Products</h1>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Search: wuxuu isticmaalaa /api/products/search */}
      <div className="relative mb-6 max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products by name..."
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-blue-400"
        />
      </div>

      {/* Products table */}
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600 text-left">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.productID} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageURL || NO_IMAGE}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                      {p.category || "Other"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    ${Number(p.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-bold ${
                        p.stockQuantity > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openEditForm(p)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Product name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="2"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Price *"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Stock quantity *"
                  value={form.stockQuantity}
                  onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <input
                type="text"
                placeholder="Category (e.g. Electronics)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
              {/* Product image: uploaded to Cloudinary through /api/upload */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-slate-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  {form.imageURL ? (
                    <img
                      src={form.imageURL}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaCloudUploadAlt className="text-2xl text-gray-300" />
                  )}
                </div>

                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 text-blue-600 font-semibold text-sm rounded-xl px-4 py-3 transition disabled:opacity-60"
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="animate-spin" /> Uploading to Cloudinary...
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt />
                        {form.imageURL ? "Change image" : "Upload product image"}
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    JPG, PNG, WEBP or GIF — max 5 MB.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition"
                >
                  {editingId ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
