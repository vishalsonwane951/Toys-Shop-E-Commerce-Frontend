import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiLogOut, FiMenu, FiX, FiSettings, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: FiGrid, label: 'Dashboard', path: '/admin' },
  { icon: FiPackage, label: 'Products', path: '/admin/products' },
  { icon: FiTag, label: 'Categories', path: '/admin/categories' },
  { icon: FiShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: FiUsers, label: 'Users', path: '/admin/users' },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-xl">🚗</div>
          {sidebarOpen && <div>
            <p className="font-display font-bold text-white text-lg leading-none">Shakti Toys</p>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>}
        </div>
      </div>
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);
          return (
            <Link key={path} to={path} onClick={() => setMobileSidebar(false)}
              className={'flex items-center gap-3 px-3 py-3 rounded-xl transition-all ' + (isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white')}>
              <Icon size={20} className="flex-shrink-0" />
              <AnimatePresence>{sidebarOpen && <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="text-sm font-medium overflow-hidden whitespace-nowrap">{label}</motion.span>}</AnimatePresence>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          {sidebarOpen && <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>}
        </div>
        <button onClick={() => { logout(); navigate('/'); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all text-sm">
          <FiLogOut size={18} className="flex-shrink-0" />
          {sidebarOpen && 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside animate={{ width: sidebarOpen ? 240 : 72 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-gray-900 text-white flex-shrink-0 relative overflow-hidden">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-6 -right-3 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center z-10 shadow-lg hover:bg-orange-600 transition-colors">
          {sidebarOpen ? <FiX size={12} /> : <FiMenu size={12} />}
        </button>
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileSidebar(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-gray-900 text-white z-50">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setMobileSidebar(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100">
            <FiMenu size={22} />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-gray-900 text-lg">
              {navItems.find(n => n.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(n.path))?.label || 'Admin'}
            </h1>
          </div>
          <Link to="/" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">← View Store</Link>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}