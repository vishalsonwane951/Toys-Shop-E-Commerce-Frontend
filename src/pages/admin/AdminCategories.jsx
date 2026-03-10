import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '🎮' });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => api.get('/categories').then(r => setCategories(r.data.categories));
  useEffect(() => { fetch(); }, []);

  const closeForm = () => { setShowForm(false); setEditCat(null); setForm({ name: '', description: '', icon: '🎮' }); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (editCat) { await api.put(`/categories/${editCat._id}`, fd); toast.success('Updated!'); }
      else { await api.post('/categories', fd); toast.success('Created!'); }
      fetch(); closeForm();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete category?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary-500 hover:bg-primary-400 text-dark-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat._id} className="bg-dark-800 border border-white/10 rounded-2xl p-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <div className="font-semibold">{cat.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{cat.description}</div>
              </div>
            </div>
            <div className="flex gap-2 ml-3 shrink-0">
              <button onClick={() => { setEditCat(cat); setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '🎮' }); setShowForm(true); }} className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 bg-blue-500/10 rounded-lg transition-colors">Edit</button>
              <button onClick={() => handleDelete(cat._id)} className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-500/10 rounded-lg transition-colors">Del</button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-dark-800 border border-white/10 rounded-3xl p-6 w-full max-w-md">
              <div className="flex justify-between mb-5">
                <h2 className="font-display text-xl font-bold">{editCat ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={closeForm} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Icon (emoji)</label>
                  <input value={form.icon} onChange={e => setForm(f => ({...f, icon: e.target.value}))} className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={2} className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500/50 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="flex-1 bg-primary-500 hover:bg-primary-400 disabled:opacity-60 text-dark-900 font-bold py-3 rounded-xl text-sm transition-colors">
                    {submitting ? 'Saving...' : editCat ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={closeForm} className="px-5 bg-dark-700 hover:bg-dark-600 text-white py-3 rounded-xl text-sm transition-colors">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
