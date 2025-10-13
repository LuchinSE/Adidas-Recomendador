import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Service/useAuth'; 

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth(); // Usar el hook

  const handleLogout = () => {
    logout();
  };

  const handleUserMenuClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
      <div className="container">
        {/* Logo */}
        <div className="navbar-brand d-flex align-items-center">
          <div 
            className="volcano-icon me-2 d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--burgundy-primary), var(--purple-accent))'
            }}
          >
            <i className="bi bi-volcano text-white"></i>
          </div>
          <span className="fw-bold fs-4" style={{ color: 'var(--burgundy-dark)' }}>
            AQP Marketplace
          </span>
        </div>

        {/* Search Bar - Centered */}
        <div className="navbar-collapse">
          <div className="navbar-nav mx-auto">
            <div className="search-container" style={{ minWidth: '400px' }}>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control search-input" 
                  placeholder="Buscar productos, marcas..."
                  style={{ borderRadius: '25px 0 0 25px' }}
                />
                <button 
                  className="btn search-btn" 
                  type="button"
                  style={{ 
                    borderRadius: '0 25px 25px 0',
                    background: 'linear-gradient(135deg, var(--burgundy-primary), var(--purple-accent))',
                    color: 'white'
                  }}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="navbar-nav">
          <div className="nav-item dropdown">
            <button 
              className="btn btn-link nav-link d-flex align-items-center p-0 border-0"
              onClick={handleUserMenuClick}
              style={{ color: 'var(--burgundy-dark)' }}
            >
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center me-2"
                style={{
                  width: '40px',
                  height: '40px',
                  background: isAuthenticated 
                    ? 'linear-gradient(135deg, var(--burgundy-primary), var(--purple-accent))'
                    : 'var(--border-light)',
                  color: isAuthenticated ? 'white' : 'var(--text-light)'
                }}
              >
                <i className={`bi ${isAuthenticated ? 'bi-person-fill' : 'bi-person'}`}></i>
              </div>
              <span className="d-none d-md-inline">
                {isAuthenticated ? (user?.nombre || 'Usuario') : 'Iniciar Sesión'}
              </span>
              {isAuthenticated && (
                <i className={`bi bi-chevron-down ms-1 ${showUserMenu ? 'rotate-180' : ''}`}></i>
              )}
            </button>

            {/* Dropdown Menu (solo para usuarios autenticados) */}
            {isAuthenticated && showUserMenu && (
              <div 
                className="dropdown-menu show shadow border-0 mt-2"
                style={{
                  position: 'absolute',
                  right: 0,
                  left: 'auto',
                  minWidth: '200px',
                  borderRadius: '12px'
                }}
              >
                <div className="dropdown-header text-muted small">
                  Hola, {user?.nombre || 'Usuario'}
                </div>
                <hr className="dropdown-divider" />
                <button 
                  className="dropdown-item"
                  onClick={() => navigate('/profile')}
                >
                  <i className="bi bi-person me-2"></i>
                  Mi Perfil
                </button>
                <button 
                  className="dropdown-item"
                  onClick={() => navigate('/favorites')}
                >
                  <i className="bi bi-heart me-2"></i>
                  Favoritos
                </button>
                <hr className="dropdown-divider" />
                <button 
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;