import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Service/useAuth'; 

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

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

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirigir a la página de búsqueda con el término
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Función para buscar al presionar Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleHomeClick = () => {
    navigate('/marketplace');
  }

    return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3" style={{ position: 'relative', zIndex: 1030 }}>
      <div className="container">
        {/* Logo */}
         <button 
          className="navbar-brand d-flex align-items-center border-0 bg-transparent p-0"
          onClick={handleHomeClick}
          style={{ cursor: 'pointer' }}
        >
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
        </button>

        {/* Search Bar - Centered */}
        <div className="navbar-collapse">
          <div className="navbar-nav mx-auto">
            <form onSubmit={handleSearch} className="search-container" style={{ minWidth: '400px' }}>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control search-input" 
                  placeholder="Buscar productos, marcas..."
                  style={{ borderRadius: '25px 0 0 25px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  className="btn search-btn" 
                  type="submit"
                  style={{ 
                    borderRadius: '0 25px 25px 0',
                    background: 'linear-gradient(135deg, var(--burgundy-primary), var(--purple-accent))',
                    color: 'white'
                  }}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

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

            {isAuthenticated && showUserMenu && (
              <div 
                className="dropdown-menu show shadow border-0 mt-2"
                style={{
                  position: 'absolute',
                  right: 0,
                  left: 'auto',
                  minWidth: '200px',
                  borderRadius: '12px',
                  zIndex: 1050 
                }}
              >
                <div className="dropdown-header text-muted small">
                  Hola, {user?.nombre || 'Usuario'}
                </div>
                <hr className="dropdown-divider" />
                <button 
                  className="dropdown-item"
                  onClick={() => navigate('/mi-cuenta')}
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