import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Views/Login";
import Register from "./Views/Register";
import Dashboard from "./Views/Dashborad";
import authService from "./Service/authService";
import Marketplace from './Views/Marketplace';
import ProductDetail from './Views/ProductDetail';
//import { AuthProvider } from './Service/useAuth'; 
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    //<AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/marketplace" /> :
              <Login onLoginSuccess={handleLoginSuccess} />
            } 
          />
          
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
              <Navigate to="/marketplace" /> :
              <Register />
            } 
          />
          
          {/* Rutas protegidas (solo para usuarios autenticados) */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard /> : 
              <Navigate to="/login" />
            } 
          />

          {/* Rutas públicas (accesibles como invitado) */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Rutas por defecto */}
          <Route path="/" element={<Navigate to="/marketplace" />} />
          <Route path="*" element={<Navigate to="/marketplace" />} />
        </Routes>
      </Router>
  //  </AuthProvider>
  );
}

export default App;