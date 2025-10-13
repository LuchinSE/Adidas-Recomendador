import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from './Modals/Navbar';
import Footer from './Modals/Footer';
import '../css/ProductDatail.css';
import { useAuth } from '../Service/useAuth';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagenActiva, setImagenActiva] = useState(0);
  const [favorito, setFavorito] = useState(false);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const { requireAuth } = useAuth();

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/prendas/${id}`);
      setProducto(response.data);
      
      const relacionadosResponse = await axios.get(`http://localhost:8080/prendas/categoria/${response.data.categoria}`);
      setProductosRelacionados(relacionadosResponse.data.filter(p => p.id !== response.data.id).slice(0, 4));
      
    } catch (err) {
      setError('Error al cargar el producto');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorito = () => {
    if (!requireAuth('agregar a favoritos')) { return; }
    setFavorito(!favorito);
    
  };

  const contactarVendedor = () => {
    if (!requireAuth('contactar al vendedor')) {return;}
    alert('Función de contacto próximamente disponible');
  };

  if (loading) {
    return (
      <div className="product-detail-bg min-vh-100">
        <Navbar />
        <div className="container product-detail-container">
          <div className="d-flex justify-content-center align-items-center detail-loading">
            <div className="text-center">
              <div className="spinner-border loading-spinner" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted fw-semibold">Cargando producto...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="product-detail-bg min-vh-100">
        <Navbar />
        <div className="container product-detail-container">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="text-center">
              <div className="alert error-alert text-center p-4">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error || 'Producto no encontrado'}
              </div>
              <button 
                className="btn detail-btn detail-btn-outline mt-3"
                onClick={() => navigate('/')}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver al Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Simular múltiples imágenes (en un caso real vendrían del backend)
  const imagenes = [
    producto.url_imagen_completa || `http://localhost:8082/static/imagenes/${producto.ruta_imagen.split('/').pop()}`,
    producto.url_imagen_completa || `http://localhost:8082/static/imagenes/${producto.ruta_imagen.split('/').pop()}`,
    producto.url_imagen_completa || `http://localhost:8082/static/imagenes/${producto.ruta_imagen.split('/').pop()}`,
  ];

  return (
    <div className="product-detail-bg">
      {/* Navbar */}
      <Navbar />

      <div className="container product-detail-container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Marketplace</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/categoria/${producto.categoria}`}>{producto.categoria}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {producto.descripcion}
            </li>
          </ol>
        </nav>

        {/* Product Detail Card */}
        <div className="product-detail-card">
          <div className="row g-0">
            {/* Gallery Column */}
            <div className="col-lg-6">
              <div className="product-gallery">
                <img 
                  src={imagenes[imagenActiva]}
                  className="product-main-image"
                  alt={producto.descripcion}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=Imagen+No+Disponible';
                  }}
                />
                <div className="product-thumbnails">
                  {imagenes.map((imagen, index) => (
                    <img
                      key={index}
                      src={imagen}
                      className={`product-thumbnail ${index === imagenActiva ? 'active' : ''}`}
                      alt={`Vista ${index + 1} de ${producto.descripcion}`}
                      onClick={() => setImagenActiva(index)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=Imagen';
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="col-lg-6">
              <div className="product-info">
                <span className="product-category-badge text-white">
                  <i className="bi bi-tag me-1 text-white"></i>
                  {producto.categoria}
                </span>

                <h1 className="product-title">{producto.descripcion}</h1>
                
                <p className="product-description">
                  {producto.descripcion_larga || `Hermosa prenda de ${producto.categoria.toLowerCase()} en excelente estado. Perfecta para ocasiones especiales y uso diario.`}
                </p>

                <div className="product-price-section">
                  <div className="d-flex align-items-center">
                    <span className="product-price">S/{producto.precio || '--'}</span>
                    {producto.precio_original && (
                      <>
                        <span className="product-original-price">S/{producto.precio_original}</span>
                        <span className="product-discount">
                          -{Math.round((1 - producto.precio / producto.precio_original) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <span className={`badge ${producto.estado ? 'bg-success' : 'bg-secondary'}`}>
                      {producto.estado ? 'Disponible' : 'Agotado'}
                    </span>
                    <span className="text-muted">
                      <i className="bi bi-eye me-1"></i>
                      125 vistas
                    </span>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="product-meta">
                  <div className="meta-item">
                    <div className="meta-icon">
                      <i className="bi bi-truck"></i>
                    </div>
                    <div className="meta-text">
                      <span className="meta-label">Envío</span>
                      <span className="meta-value">Gratis</span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-icon">
                      <i className="bi bi-shield-check"></i>
                    </div>
                    <div className="meta-text">
                      <span className="meta-label">Garantía</span>
                      <span className="meta-value">30 días</span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-icon">
                      <i className="bi bi-arrow-repeat"></i>
                    </div>
                    <div className="meta-text">
                      <span className="meta-label">Devolución</span>
                      <span className="meta-value">Sí</span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-icon">
                      <i className="bi bi-star"></i>
                    </div>
                    <div className="meta-text">
                      <span className="meta-label">Calificación</span>
                      <span className="meta-value">4.8/5</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="product-actions">
                  <button 
                    className={`detail-btn ${favorito ? 'detail-btn-primary' : 'detail-btn-outline'}`}
                    onClick={toggleFavorito}
                  >
                    <i className={`bi ${favorito ? 'bi-star-fill' : 'bi-star'}`}></i>
                    {favorito ? 'En Favoritos' : 'Añadir a Favoritos'}
                  </button>
                  
                  <button 
                    className="detail-btn detail-btn-primary"
                    onClick={contactarVendedor}
                    disabled={!producto.estado}
                  >
                    <i className="bi bi-whatsapp"></i>
                    Contactar Vendedor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {productosRelacionados.length > 0 && (
          <div className="related-products">
            <h3 className="related-header">Productos Relacionados</h3>
            <div className="row g-4">
              {productosRelacionados.map((productoRel) => (
                <div key={productoRel.id} className="col-6 col-md-4 col-lg-3">
                  <div className="product-card h-100">
                    <img 
                      src={productoRel.url_imagen_completa || `http://localhost:8082/static/imagenes/${productoRel.ruta_imagen.split('/').pop()}`}
                      className="product-image"
                      alt={productoRel.descripcion}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+No+Disponible';
                      }}
                    />
                    <div className="card-body">
                      <h6 className="product-title">{productoRel.descripcion}</h6>
                      <p className="product-category mb-2">{productoRel.categoria}</p>
                      <div className="card-buttons">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="product-price">S/{productoRel.precio || '--'}</span>
                        </div>
                        <button 
                          className="btn product-btn product-btn-outline w-100"
                          onClick={() => navigate(`/producto/${productoRel.id}`)}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetail;