import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Modals/Navbar';
import Footer from './Modals/Footer';
import '../css/MarketplaceTheme.css';

const Recommendation = () => {
  const [vista, setVista] = useState('favoritos'); // 'favoritos', 'combinar', 'recomendaciones'
  const [productosSeleccionados, setProductosSeleccionados] = useState(new Set());
  const [mostrarModalRecomendacion, setMostrarModalRecomendacion] = useState(false);

  // Datos de ejemplo - Productos en favoritos
  const [favoritos] = useState([
    {
      id: 1,
      descripcion: "Camiseta Básica Negra",
      categoria: "Camisetas",
      precio: 25.99,
      estado: true,
      url_imagen_completa: "https://via.placeholder.com/300x300/722F37/FFFFFF?text=Camiseta+Negra",
      tipo: "superior"
    },
    {
      id: 2,
      descripcion: "Jeans Slim Fit Azul",
      categoria: "Pantalones",
      precio: 89.99,
      estado: true,
      url_imagen_completa: "https://via.placeholder.com/300x300/1E3A8A/FFFFFF?text=Jeans+Azul",
      tipo: "inferior"
    },
    {
      id: 3,
      descripcion: "Chaqueta de Cuero Marrón",
      categoria: "Chaquetas",
      precio: 199.99,
      estado: true,
      url_imagen_completa: "https://via.placeholder.com/300x300/7C2D12/FFFFFF?text=Chaqueta+Cuero",
      tipo: "abrigo"
    },
    {
      id: 4,
      descripcion: "Zapatos Deportivos Blancos",
      categoria: "Calzado",
      precio: 120.00,
      estado: true,
      url_imagen_completa: "https://via.placeholder.com/300x300/F8FAFC/172554?text=Zapatos+Blancos",
      tipo: "calzado"
    },
    {
      id: 5,
      descripcion: "Blusa Elegante Seda",
      categoria: "Blusas",
      precio: 65.80,
      estado: true,
      url_imagen_completa: "https://via.placeholder.com/300x300/F0FDF4/166534?text=Blusa+Seda",
      tipo: "superior"
    },
    {
      id: 6,
      descripcion: "Falda Plisada Negra",
      categoria: "Faldas",
      precio: 55.50,
      estado: true,
      url_imagen_completa: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Falda+Negra",
      tipo: "inferior"
    }
  ]);

  // Productos recomendados (simulados)
  const [recomendaciones] = useState([
    {
      id: 101,
      descripcion: "Chaqueta Denim Azul",
      categoria: "Chaquetas",
      precio: 79.99,
      estado: true,
      url_imagen_completa: "https://via.placeholder.com/300x300/1E40AF/FFFFFF?text=Chaqueta+Denim",
      puntuacion: 95,
      razon: "Combina perfectamente con tus jeans azules"
    },
    {
      id: 102,
      descripcion: "Zapatos Casuales Marrón",
      categoria: "Calzado",
      precio: 89.99,
      estado: true,
      url_imagen_completa: "https://via.placeholder.com/300x300/92400E/FFFFFF?text=Zapatos+Marrón",
      puntuacion: 88,
      razon: "Complementa tu estilo casual"
    },
    {
      id: 103,
      descripcion: "Camiseta Blanca Básica",
      categoria: "Camisetas",
      precio: 22.99,
      estado: true,
      url_imagen_completa: "https://via.placeholder.com/300x300/FFFFFF/000000?text=Camiseta+Blanca",
      puntuacion: 92,
      razon: "Versátil para múltiples combinaciones"
    },
    {
      id: 104,
      descripcion: "Gorra Negra Deportiva",
      categoria: "Accesorios",
      precio: 19.99,
      estado: true,
      url_imagen_completa: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Gorra+Negra",
      puntuacion: 85,
      razon: "Añade un toque sport a tu outfit"
    }
  ]);

  const toggleSeleccion = (productoId) => {
    setProductosSeleccionados(prev => {
      const nuevos = new Set(prev);
      if (nuevos.has(productoId)) {
        nuevos.delete(productoId);
      } else {
        nuevos.add(productoId);
      }
      return nuevos;
    });
  };

  const iniciarCombinacion = () => {
    setVista('combinar');
    setProductosSeleccionados(new Set());
  };

  const generarRecomendaciones = () => {
    if (productosSeleccionados.size === 0) {
      alert('Selecciona al menos un producto para combinar');
      return;
    }
    setVista('recomendaciones');
    setMostrarModalRecomendacion(true);
  };

  const volverAFavoritos = () => {
    setVista('favoritos');
    setProductosSeleccionados(new Set());
  };

  const obtenerProductosSeleccionados = () => {
    return favoritos.filter(producto => productosSeleccionados.has(producto.id));
  };

  // Vista: Mis Favoritos
  if (vista === 'favoritos') {
    return (
      <div className="marketplace-bg">
        <Navbar />
        
        <div className="container my-5 pt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-header mb-0">
              <i className="bi bi-heart-fill me-3 text-danger"></i>
              Mis Favoritos
            </h2>
            <button 
              className="btn banner-btn btn-crear-combinacion"  // <- agregado btn-crear-combinacion
              onClick={iniciarCombinacion}
            >
              <i className="bi bi-magic me-2"></i>
              Crear Combinación
            </button>
          </div>

          <div className="row g-4">
            {favoritos.map((producto) => (
              <div key={producto.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
                <div className="product-card w-100">
                  <img
                    src={producto.url_imagen_completa}
                    className="product-image"
                    alt={producto.descripcion}
                  />
                  <div className="card-body">
                    <h5 className="product-title">{producto.descripcion}</h5>
                    <p className="product-category text-muted">
                      <i className="bi bi-tag me-1"></i>
                      {producto.categoria} • {producto.tipo}
                    </p>
                    <div className="card-buttons">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="product-price">S/{producto.precio.toFixed(2)}</span>
                        <span className="badge bg-primary">{producto.tipo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Vista: Seleccionar para Combinar
  if (vista === 'combinar') {
    const productosSeleccionadosLista = obtenerProductosSeleccionados();
    
    return (
      <div className="marketplace-bg">
        <Navbar />
        
        <div className="container my-5 pt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <button 
                className="btn btn-outline-secondary me-3"
                onClick={volverAFavoritos}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver
              </button>
              <h2 className="section-header mb-0 d-inline">
                Selecciona Productos para Combinar
              </h2>
            </div>
            <div className="d-flex align-items-center">
              <span className="badge bg-primary me-3">
                {productosSeleccionados.size} seleccionados
              </span>
              <button 
                className="btn banner-btn"
                onClick={generarRecomendaciones}
                disabled={productosSeleccionados.size === 0}
              >
                <i className="bi bi-stars me-2"></i>
                Generar Recomendaciones
              </button>
            </div>
          </div>

          {/* Productos Seleccionados Preview */}
          {productosSeleccionados.size > 0 && (
            <div className="mb-4 p-4 bg-light rounded-3">
              <h5 className="mb-3">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Productos seleccionados para combinar:
              </h5>
              <div className="row g-2">
                {productosSeleccionadosLista.map(producto => (
                  <div key={producto.id} className="col-auto">
                    <div className="bg-white rounded p-2 border d-flex align-items-center">
                      <img 
                        src={producto.url_imagen_completa} 
                        alt={producto.descripcion}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                        className="me-2"
                      />
                      <span className="small">{producto.descripcion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="row g-4">
            {favoritos.map((producto) => (
              <div key={producto.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
                <div 
                  className={`product-card w-100 ${productosSeleccionados.has(producto.id) ? 'selected-combination' : ''}`}
                  style={{
                    border: productosSeleccionados.has(producto.id) ? '3px solid #722F37' : '1px solid #dee2e6'
                  }}
                >
                  <div className="position-relative">
                    <img
                      src={producto.url_imagen_completa}
                      className="product-image"
                      alt={producto.descripcion}
                    />
                    {productosSeleccionados.has(producto.id) && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-success">
                          <i className="bi bi-check-lg"></i>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="product-title">{producto.descripcion}</h5>
                    <p className="product-category text-muted">
                      <i className="bi bi-tag me-1"></i>
                      {producto.categoria} • {producto.tipo}
                    </p>
                    <div className="card-buttons">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="product-price">S/{producto.precio.toFixed(2)}</span>
                        <span className="badge bg-primary">{producto.tipo}</span>
                      </div>
                      <button
                        className={`btn w-100 ${productosSeleccionados.has(producto.id) ? 'btn-success' : 'btn-outline-primary'}`}
                        onClick={() => toggleSeleccion(producto.id)}
                      >
                        {productosSeleccionados.has(producto.id) ? (
                          <>
                            <i className="bi bi-check-lg me-2"></i>
                            Seleccionado
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus me-2"></i>
                            Seleccionar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Vista: Recomendaciones
  if (vista === 'recomendaciones') {
    const productosSeleccionadosLista = obtenerProductosSeleccionados();
    
    return (
      <div className="marketplace-bg">
        <Navbar />
        
        <div className="container my-5 pt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <button 
                className="btn btn-outline-secondary me-3"
                onClick={volverAFavoritos}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver a Favoritos
              </button>
              <h2 className="section-header mb-0 d-inline">
                <i className="bi bi-stars me-3 text-warning"></i>
                Recomendaciones para Ti
              </h2>
            </div>
            <button 
              className="btn banner-btn"
              onClick={iniciarCombinacion}
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              Nueva Combinación
            </button>
          </div>

          {/* Resumen de la Combinación */}
          <div className="mb-5 p-4 bg-light rounded-3">
            <h5 className="mb-3">Basado en tu selección:</h5>
            <div className="row g-3">
              {productosSeleccionadosLista.map(producto => (
                <div key={producto.id} className="col-md-6 col-lg-4">
                  <div className="bg-white rounded p-3 border d-flex align-items-center">
                    <img 
                      src={producto.url_imagen_completa} 
                      alt={producto.descripcion}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      className="me-3"
                    />
                    <div>
                      <h6 className="mb-1">{producto.descripcion}</h6>
                      <small className="text-muted">{producto.categoria} • {producto.tipo}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recomendaciones */}
          <h4 className="mb-4">Productos que combinan con tu estilo:</h4>
          <div className="row g-4">
            {recomendaciones.map((producto) => (
              <div key={producto.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
                <div className="product-card w-100 recommendation-card">
                  <div className="position-relative">
                    <img
                      src={producto.url_imagen_completa}
                      className="product-image"
                      alt={producto.descripcion}
                    />
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge bg-warning text-dark">
                        <i className="bi bi-star-fill me-1"></i>
                        {producto.puntuacion}%
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="product-title">{producto.descripcion}</h5>
                    <p className="product-category text-muted">
                      <i className="bi bi-tag me-1"></i>
                      {producto.categoria}
                    </p>
                    <div className="recommendation-reason mb-3">
                      <small className="text-success">
                        <i className="bi bi-lightbulb me-1"></i>
                        {producto.razon}
                      </small>
                    </div>
                    <div className="card-buttons">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="product-price">S/{producto.precio.toFixed(2)}</span>
                        <span className="badge bg-success">Disponible</span>
                      </div>
                      <div className="d-grid gap-2">
                        <button className="btn product-btn-primary">
                          <i className="bi bi-cart-plus me-2"></i>
                          Agregar al Carrito
                        </button>
                        <button className="btn product-btn-outline">
                          <i className="bi bi-heart me-2"></i>
                          Agregar a Favoritos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />

        {/* Modal de Procesamiento IA (simulado) */}
        {mostrarModalRecomendacion && (
          <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center p-5">
                  <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}>
                    <span className="visually-hidden">Procesando...</span>
                  </div>
                  <h4 className="mb-3">Analizando tu estilo con IA</h4>
                  <p className="text-muted">
                    Nuestra inteligencia artificial está buscando las mejores combinaciones para ti...
                  </p>
                  <div className="progress mb-3">
                    <div 
                      className="progress-bar progress-bar-striped progress-bar-animated" 
                      style={{width: '100%'}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default Recommendation;