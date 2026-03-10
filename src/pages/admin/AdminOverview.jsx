import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  processing: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400'
};

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/stats').then(r => { setStats(r.data.stats); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading stats...</div>;

  const cards = [
    { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: '💰', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: '🏷️', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`bg-dark-800 border rounded-2xl p-6 ${card.bg}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className={`font-display text-3xl font-bold ${card.color} mb-1`}>{card.value}</div>
            <div className="text-sm text-gray-400">{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold mb-5">Recent Orders</h2>
        <div className="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-dark-700 border-b border-white/10">
              <tr>
                {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((order, i) => (
                <tr key={order._id} className={`border-t border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? '' : 'bg-white/2'}`}>
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-3">{order.user?.name}</td>
                  <td className="px-5 py-3 text-primary-400 font-semibold">${order.totalPrice?.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-700 text-gray-300'}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
