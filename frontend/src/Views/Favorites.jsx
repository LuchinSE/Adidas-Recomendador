import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Modals/Navbar';
import Footer from './Modals/Footer';
import { useAuth } from '../Service/useAuth';
import { favoritesService } from '../Service/favoritesService';
import '../css/MarketplaceTheme.css';

const Favorites = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getIdCliente, isAuthenticated } = useAuth();

  
  useEffect(() => {
    if (isAuthenticated) {
      cargarFavoritos();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const cargarFavoritos = async () => {
    try {
      setLoading(true);
      setError(null);

      const idCliente = getIdCliente();
      if (!idCliente) {
        setError('No se pudo identificar al usuario');
        return;
      }

      await favoritesService.crearFavorito(idCliente);
      const idsFavoritos = await favoritesService.obtenerIdsFavoritos(idCliente);
      
      if (idsFavoritos && idsFavoritos.length > 0) {
        const productos = await favoritesService.obtenerProductosPorIds(idsFavoritos);
        
        const favoritosFormateados = productos.map(producto => ({
          id: producto.id,
          descripcion: producto.descripcion || producto.nombre,
          categoria: producto.categoria || 'Sin categoría',
          precio: producto.precio || 0,
          estado: producto.estado !== undefined ? producto.estado : true,
          ruta_imagen: producto.url_imagen_completa || producto.ruta_imagen,
          esFavorito: true
        }));
        
        setFavoritos(favoritosFormateados);
      } else {
        setFavoritos([]);
      }
    } catch (err) {
      console.error('Error cargando favoritos:', err);
      setError('No se pudieron cargar los favoritos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };


  const toggleFavorito = async (prendaId) => {
    try {
      const idCliente = getIdCliente();
      if (!idCliente) {
        alert('No se pudo identificar al usuario');
        return;
      }
      await favoritesService.eliminarFavorito(idCliente, prendaId);
      setFavoritos(prevFavoritos => 
        prevFavoritos.filter(prenda => prenda.id !== prendaId)
      );
    } catch (error) {
      console.error('Error eliminando favorito:', error);
      setError('No se pudo eliminar el producto de favoritos.');
    }
  };

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    return typeof precio === 'number' ? precio.toFixed(2) : '0.00';
  };

  if (loading) {
    return (
      <div className="marketplace-bg">
        <Navbar />
        <div className="container my-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando tus favoritos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="marketplace-bg">
        <Navbar />
        <div className="container my-5">
          <div className="alert alert-danger text-center">
            {error}
            <div className="mt-3">
              <button className="btn product-btn product-btn-primary" onClick={cargarFavoritos}>
                Reintentar
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="marketplace-bg">
      {/* Navbar */}
      <Navbar />

      {/* Banner de Favoritos */}
      <div className="container-fluid banner-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="banner-title mb-3">
                Tus Productos Favoritos
              </h1>
              <p className="banner-text mb-4">
                Guarda los productos que más te gustan y compra cuando estés listo. 
                Tus favoritos están siempre aquí esperándote.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <span className="badge bg-burgundy-primary fs-6 px-3 py-2">
                  <i className="bi bi-heart-fill me-2"></i>
                  {favoritos.length} Productos guardados
                </span>
                <span className="badge bg-purple-accent fs-6 px-3 py-2">
                  <i className="bi bi-clock me-2"></i>
                  Siempre disponibles
                </span>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <div className="category-icon mx-auto" style={{width: '120px', height: '120px'}}>
                <i className="bi bi-heart-fill" style={{fontSize: '3rem'}}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container my-5">
        {/* Header con estadísticas */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h2 className="section-header mb-0">
                Mis Favoritos
              </h2>
              <div className="d-flex gap-3 align-items-center">
                <span className="text-muted">
                  Mostrando {favoritos.length} productos
                </span>
                <Link to="/marketplace" className="btn product-btn product-btn-outline">
                  <i className="bi bi-arrow-left me-2"></i>
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Favoritos */}
        {favoritos.length > 0 ? (
          <div className="row g-4">
            {favoritos.map((prenda) => (
              <div key={prenda.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
                <div className="product-card w-100">
                  <div className="position-relative">
                    <img 
                      src={`http://localhost:8082/static/imagenes/${prenda.ruta_imagen.split('/').pop()}`}
                      className="product-image"
                      alt={prenda.descripcion}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+No+Disponible';
                      }}
                    />
                    {/* Badge de favorito */}
                    <div className="position-absolute top-0 end-0 m-3">
                      <button 
                        className="btn btn-light rounded-circle p-2 shadow-sm"
                        onClick={() => toggleFavorito(prenda.id)}
                        style={{width: '40px', height: '40px'}}
                      >
                        <i className="bi bi-heart-fill text-danger"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h5 className="product-title">{prenda.descripcion}</h5>
                    <p className="product-category">
                      <i className="bi bi-tag me-1"></i>
                      {prenda.categoria}
                    </p>
                    
                    <div className="card-buttons">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="product-price">S/{formatearPrecio(prenda.precio)}</span>
                        <span className={`badge ${prenda.estado ? 'bg-success' : 'bg-secondary'}`}>
                          {prenda.estado ? 'Disponible' : 'Agotado'}
                        </span>
                      </div>
                      
                      <div className="d-grid gap-2">    
                        <button 
                          className="btn product-btn product-btn-outline"
                          onClick={() => toggleFavorito(prenda.id)}
                        >
                          <i className="bi bi-trash me-2"></i>
                          Quitar de Favoritos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Estado vacío */
          <div className="text-center py-5 my-5">
            <div className="category-icon mx-auto mb-4" style={{width: '100px', height: '100px'}}>
              <i className="bi bi-heart" style={{fontSize: '2.5rem'}}></i>
            </div>
            <h3 className="text-muted mb-3">No tienes favoritos aún</h3>
            <p className="text-muted mb-4">
              Explora nuestro catálogo y guarda los productos que más te gusten.
            </p>
            <Link to="/marketplace" className="btn product-btn product-btn-primary px-4">
              <i className="bi bi-bag me-2"></i>
              Descubrir Productos
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Favorites;