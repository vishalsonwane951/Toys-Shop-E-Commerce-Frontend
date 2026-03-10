import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', originalPrice: '', category: '', brand: '', stock: '', isFeatured: false, discount: 0 });
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products', { params: { page, limit: 10 } }).then(r => {
      setProducts(r.data.products);
      setPages(r.data.pages);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProducts();
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, [page]);

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '', category: p.category?._id || '', brand: p.brand || '', stock: p.stock, isFeatured: p.isFeatured, discount: p.discount || 0 });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditProduct(null); setForm({ name: '', description: '', price: '', originalPrice: '', category: '', brand: '', stock: '', isFeatured: false, discount: 0 }); setImages([]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated!');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created!');
      }
      fetchProducts();
      closeForm();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary-500 hover:bg-primary-400 text-dark-900 font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Product
        </button>
      </div>

      <div className="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-700 border-b border-white/10">
            <tr>
              {['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : products.map(p => (
              <tr key={p._id} className="border-t border-white/5 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3">
                  <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-dark-700" onError={e => e.target.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=50'} />
                </td>
                <td className="px-4 py-3 font-medium max-w-48">
                  <div className="truncate">{p.name}</div>
                  {p.brand && <div className="text-xs text-gray-400">{p.brand}</div>}
                </td>
                <td className="px-4 py-3 text-gray-400">{p.category?.name}</td>
                <td className="px-4 py-3 text-primary-400 font-semibold">${p.price?.toFixed(2)}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{p.stock}</span></td>
                <td className="px-4 py-3">{p.isFeatured ? '⭐' : '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="text-blue-400 hover:text-blue-300 text-xs px-3 py-1.5 bg-blue-500/10 rounded-lg transition-colors">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 bg-red-500/10 rounded-lg transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex gap-2">
          {[...Array(pages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i+1)} className={`w-9 h-9 rounded-lg text-sm transition-colors ${page === i+1 ? 'bg-primary-500 text-dark-900' : 'bg-dark-800 border border-white/10 text-gray-400 hover:border-primary-500/50'}`}>{i+1}</button>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 border border-white/10 rounded-3xl p-6 w-full max-w-xl max-h-screen overflow-y-auto my-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={closeForm} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none">×</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-400 mb-1 block">Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-400 mb-1 block">Description *</label>
                    <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50 resize-none" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Price *</label>
                    <input type="number" step="0.01" required value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Original Price</label>
                    <input type="number" step="0.01" value={form.originalPrice} onChange={e => setForm(f => ({...f, originalPrice: e.target.value}))} className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Category *</label>
                    <select required value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Brand</label>
                    <input value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))} className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Stock *</label>
                    <input type="number" required value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Discount (%)</label>
                    <input type="number" min="0" max="100" value={form.discount} onChange={e => setForm(f => ({...f, discount: e.target.value}))} className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-400 mb-1 block">Product Images</label>
                    <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files))} className="w-full text-sm text-gray-400 file:mr-3 file:bg-primary-500/20 file:text-primary-400 file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:text-xs cursor-pointer" />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm(f => ({...f, isFeatured: e.target.checked}))} className="accent-primary-500 w-4 h-4" />
                    <label htmlFor="featured" className="text-sm text-gray-400">Featured Product</label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting} className="flex-1 bg-primary-500 hover:bg-primary-400 disabled:opacity-60 text-dark-900 font-bold py-3 rounded-xl transition-colors text-sm">
                    {submitting ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button type="button" onClick={closeForm} className="px-5 bg-dark-700 hover:bg-dark-600 text-white py-3 rounded-xl transition-colors text-sm">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
