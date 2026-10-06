import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser } from '../services/authService';

const AuthContext = createContext();

const normalizeUser = (userData) => {
  if (!userData) {
    return userData;
  }

  const id = userData._id || userData.id;
  return id ? { ...userData, _id: id } : userData;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gamemate_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(normalizeUser(response.data.user));
      } catch (error) {
        localStorage.removeItem('gamemate_token');
        setToken('');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [token]);

  const login = (userData, authToken) => {
    setUser(normalizeUser(userData));
    setToken(authToken);
    localStorage.setItem('gamemate_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('gamemate_token');
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout, setUser }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
