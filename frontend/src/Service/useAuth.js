// Service/useAuth.js
import { useState, useEffect } from 'react';
import authService from './authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const userData = authService.getUser();
      
      console.log("Auth check:", { authenticated, user: userData });
      
      setIsAuthenticated(authenticated);
      setUser(userData);
      setLoading(false);
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      setIsAuthenticated(true);
      setUser(authService.getUser());
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/marketplace';
  };

  const requireAuth = (action = 'realizar esta acción') => {
    if (!isAuthenticated && !loading) {
      if (window.confirm(`Para ${action}, necesitas iniciar sesión. ¿Deseas ir al login?`)) {
        window.location.href = '/login';
      }
      return false;
    }
    return true;
  };

  const getIdCliente = () => {
    return user?.idCliente || user?.id || null;
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    requireAuth,
    getIdCliente
  };
};