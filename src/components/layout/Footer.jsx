import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏎️</span>
              <span className="font-display font-bold text-xl text-gradient">Shakti Toys</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Your ultimate destination for toys, remote control cars, electronics, and gadgets.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Shop</h4>
            {['Toy Cars', 'RC Cars', 'Toy Bikes', 'Electronics', 'Gadgets', 'Batteries'].map(c => (
              <Link key={c} to={`/products?search=${c}`} className="block text-sm text-gray-400 hover:text-primary-400 mb-2 transition-colors">{c}</Link>
            ))}
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Account</h4>
            {[{ to: '/login', label: 'Sign In' }, { to: '/register', label: 'Register' }, { to: '/dashboard', label: 'My Orders' }, { to: '/cart', label: 'Cart' }].map(l => (
              <Link key={l.to} to={l.to} className="block text-sm text-gray-400 hover:text-primary-400 mb-2 transition-colors">{l.label}</Link>
            ))}
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <p className="text-sm text-gray-400 mb-2">📧 hello@shaktitoys.com</p>
            <p className="text-sm text-gray-400 mb-2">📞 +1 (555) 123-4567</p>
            <p className="text-sm text-gray-400">📍 123 Toy Street, Fun City</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-500">
          © 2024 Shakti Toys. All rights reserved. Built with ❤️ using MERN Stack.
        </div>
      </div>
    </footer>
  );
}
