import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Modals/Navbar';
import Footer from './Modals/Footer';
import { useAuth } from '../Service/useAuth';
import { favoritesService } from '../Service/favoritesService';
import '../css/MarketplaceTheme.css';

const Search = () => {
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoritos, setFavoritos] = useState(new Set());
  const [cargandoFavoritos, setCargandoFavoritos] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { requireAuth, getIdCliente, isAuthenticated } = useAuth();

  // Obtener el término de búsqueda de la URL
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    setPage(1); // Resetear a página 1 cuando cambia la búsqueda
  }, [searchParams]);

  // Cargar prendas cuando cambie la página o la búsqueda
  useEffect(() => {
    if (searchQuery) {
      cargarPrendasBusqueda();
    }
  }, [page, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      cargarFavoritosUsuario();
    }
  }, [isAuthenticated]);

  const cargarPrendasBusqueda = async () => {
    try {
      setLoading(true);
      const skip = (page - 1) * pageSize;
      
      // Usar el endpoint de búsqueda que creaste
      const response = await axios.get(
        `http://localhost:8080/prendas/search?texto=${encodeURIComponent(searchQuery)}&skip=${skip}&limit=${pageSize}`
      );
      
      setPrendas(response.data.items || response.data);
      setTotal(response.data.total || response.data.length);
    } catch (err) {
      setError('Error al buscar las prendas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarFavoritosUsuario = async () => {
    try {
      const idCliente = getIdCliente();
      if (!idCliente) return;
      await favoritesService.crearFavorito(idCliente);
      const idsFavoritos = await favoritesService.obtenerIdsFavoritos(idCliente);
      setFavoritos(new Set(idsFavoritos));
    } catch (error) {
      console.error('Error cargando favoritos del usuario:', error);
    }
  };

  const toggleFavorito = async (prendaId) => {
    if (!requireAuth('agregar a favoritos')) return;
    const idCliente = getIdCliente();
    if (!idCliente) {
      alert('No se pudo identificar al usuario');
      return;
    }
    try {
      setCargandoFavoritos(prev => new Set(prev).add(prendaId));
      const esFavoritoActual = favoritos.has(prendaId);

      if (esFavoritoActual) {
        await favoritesService.eliminarFavorito(idCliente, prendaId);
        setFavoritos(prev => {
          const nuevos = new Set(prev);
          nuevos.delete(prendaId);
          return nuevos;
        });
      } else {
        await favoritesService.agregarFavorito(idCliente, prendaId);
        setFavoritos(prev => new Set(prev).add(prendaId));
      }
    } catch (error) {
      console.error('Error actualizando favorito:', error);
      alert(`No se pudo ${favoritos.has(prendaId) ? 'eliminar' : 'agregar'} el producto de favoritos`);
    } finally {
      setCargandoFavoritos(prev => {
        const nuevos = new Set(prev);
        nuevos.delete(prendaId);
        return nuevos;
      });
    }
  };

  const verDetalles = (prendaId) => {
    navigate(`/product/${prendaId}`);
  };

  // Control de paginación
  const totalPages = Math.ceil(total / pageSize);
  const handlePrevious = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setPage(prev => Math.min(prev + 1, totalPages));

  // Render: loading / error
  if (loading) {
    return (
      <div className="marketplace-bg min-vh-100">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="text-center">
            <div className="spinner-border loading-spinner" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted fw-semibold">Buscando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="marketplace-bg min-vh-100">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="alert error-alert text-center p-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace-bg">
      <Navbar />
      {/* Resultados de Búsqueda */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="section-header mb-2">
              Resultados de búsqueda
            </h2>
            <p className="text-muted mb-0">
              {total} resultado{total !== 1 ? 's' : ''} para "{searchQuery}"
            </p>
          </div>
        </div>

        {prendas.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-search display-1 text-muted"></i>
            <h4 className="mt-3">No se encontraron resultados</h4>
            <p className="text-muted">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {prendas.map((prenda) => (
                <div key={prenda.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
                  <div className="product-card w-100">
                    <img
                      src={prenda.url_imagen_completa || `http://localhost:8082/static/${prenda.ruta_imagen}`}
                      className="product-image"
                      alt={prenda.descripcion}
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen')}
                    />
                    <div className="card-body">
                      <h5 className="product-title">{prenda.descripcion}</h5>
                      <p className="product-category text-muted">
                        <i className="bi bi-tag me-1"></i>
                        {prenda.categoria}
                      </p>
                      <div className="card-buttons">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="product-price">S/{prenda.precio || '--'}</span>
                          <span className={`badge ${prenda.estado ? 'bg-success' : 'bg-secondary'}`}>
                            {prenda.estado ? 'Disponible' : 'Agotado'}
                          </span>
                        </div>
                        <div className="d-grid gap-2">
                          <button className="btn product-btn product-btn-outline" onClick={() => verDetalles(prenda.id)}>
                            <i className="bi bi-eye me-2"></i>Detalles
                          </button>
                          <button
                            className={`btn product-btn ${favoritos.has(prenda.id) ? 'favorite-btn' : 'product-btn-outline'} ${
                              cargandoFavoritos.has(prenda.id) ? 'opacity-50' : ''
                            }`}
                            onClick={() => toggleFavorito(prenda.id)}
                            disabled={cargandoFavoritos.has(prenda.id)}
                          >
                            {cargandoFavoritos.has(prenda.id) ? (
                              <>
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                  <span className="visually-hidden">Cargando...</span>
                                </div>
                                Procesando...
                              </>
                            ) : (
                              <>
                                <i className={`bi ${favoritos.has(prenda.id) ? 'bi-star-fill' : 'bi-star'} me-2`}></i>
                                {favoritos.has(prenda.id) ? 'En Favoritos' : 'Favoritos'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginador */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-5">
                <button
                  className="btn btn-outline-secondary me-3"
                  onClick={handlePrevious}
                  disabled={page === 1}
                >
                  <i className="bi bi-arrow-left"></i> Anterior
                </button>

                <span className="fw-semibold">
                  Página {page} de {totalPages}
                </span>

                <button
                  className="btn btn-outline-secondary ms-3"
                  onClick={handleNext}
                  disabled={page === totalPages}
                >
                  Siguiente <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;