import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Views/Login";
import Register from "./Views/Register";
import Dashboard from "./Views/Dashborad";
import Marketplace from './Views/Marketplace';
import ProductDetail from './Views/ProductDetail';
import Favorites from './Views/Favorites';
import MiCuenta from './Views/Profile';
import Search from './Views/Search';
import Recommendation from './Views/Recommendation';
import { useAuth } from './Service/useAuth';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas públicas (accesibles como invitado) */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<Search />} /> 

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/mi-cuenta" element={<ProtectedRoute><MiCuenta /></ProtectedRoute>} />
        <Route path="/recomendaciones" element={<ProtectedRoute><Recommendation /></ProtectedRoute>} />

        {/* Rutas por defecto */}
        <Route path="/" element={<Navigate to="/marketplace" />} />
        <Route path="*" element={<Navigate to="/marketplace" />} />
      </Routes>
    </Router>
  );
}

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;