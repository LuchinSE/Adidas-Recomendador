import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../Service/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const userData = authService.getUser();
      setIsAuthenticated(authenticated);
      setUser(userData);
    };

    checkAuth();
  }, []);

  const requireAuth = (action = 'realizar esta acción') => {
    if (!isAuthenticated) {
      if (window.confirm(`Para ${action}, necesitas iniciar sesión. ¿Deseas ir al login?`)) {
        navigate('/login');
      }
      return false;
    }
    return true;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/marketplace');
  };

  return {
    isAuthenticated,
    user,
    requireAuth,
    logout
  };
};