import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
    catch { return []; }
  });

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ── useCallback prevents child re-renders when parent re-renders ──
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        return prev.map(i =>
          i._id === product._id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) {
      setCartItems(prev => prev.filter(i => i._id !== id));
      return;
    }
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  // ── useMemo so totals only recalculate when cartItems actually changes ──
  const { totalItems, totalPrice } = useMemo(() => ({
    totalItems: cartItems.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
  }), [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart,
      updateQuantity, clearCart, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}