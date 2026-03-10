import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { wishlistAPI } from '../../services/api';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to add to wishlist'); return; }
    try {
      await wishlistAPI.toggle(product._id);
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="card group relative">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discount > 0 && (
          <span className="badge bg-red-500 text-white">-{discount}%</span>
        )}
        {product.stock === 0 && (
          <span className="badge bg-gray-800 text-white">Out of Stock</span>
        )}
        {product.isFeatured && (
          <span className="badge bg-orange-100 text-orange-700">Featured</span>
        )}
      </div>

      {/* Wishlist */}
      <button onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        style={{ color: wishlisted ? '#ef4444' : '#6b7280' }}>
        <FiHeart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Image */}
      <Link to={'/product/' + product._id}>
        <div className="relative overflow-hidden bg-gray-50 h-48 sm:h-52">
          <img
            src={imgError ? 'https://placehold.co/400x300/f3f4f6/9ca3af?text=ToyShop' : (product.images?.[0] || 'https://placehold.co/400x300/f3f4f6/9ca3af?text=ToyShop')}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
                <FiEye size={12} /> Quick View
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-orange-500 font-medium mb-1">{product.category?.name}</p>
        <Link to={'/product/' + product._id}>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight hover:text-orange-500 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map(star => (
              <FiStar key={star} size={12}
                className={star <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.numReviews || 0})</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-2">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => product.stock > 0 && addToCart(product)}
            disabled={product.stock === 0}
            className="w-9 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md hover:shadow-orange-200">
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}