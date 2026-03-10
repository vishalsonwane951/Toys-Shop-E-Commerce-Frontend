import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const TOKEN_VERIFY_INTERVAL = 60 * 60 * 1000; // re-verify token max once per hour

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Define logout BEFORE useEffect so it's safe to call inside it ──
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenVerified');
    setUser(null);
  }, []);

  useEffect(() => {
    const token     = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) {
      setLoading(false);
      return;
    }

    // Restore from localStorage immediately — no flash of logged-out state
    setUser(JSON.parse(savedUser));

    // Only hit /auth/me if we haven't verified within the last hour
    // This removes the network round-trip on every single page load
    const lastVerified = parseInt(localStorage.getItem('tokenVerified') || '0', 10);
    const needsVerify  = Date.now() - lastVerified > TOKEN_VERIFY_INTERVAL;

    if (needsVerify) {
      api.get('/auth/me')
        .then(r => {
          setUser(r.data.user);
          localStorage.setItem('user', JSON.stringify(r.data.user));
          localStorage.setItem('tokenVerified', Date.now().toString());
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [logout]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('tokenVerified', Date.now().toString());
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('tokenVerified', Date.now().toString());
    setUser(data.user);
    return data;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}