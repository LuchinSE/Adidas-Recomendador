import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Modals/Navbar';
import Banner from './Modals/Banner';
import Footer from './Modals/Footer';
import {useAuth} from '../Service/useAuth';
import '../css/MarketplaceTheme.css';

const Marketplace = () => {
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoritos, setFavoritos] = useState(new Set());
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  useEffect(() => {
    cargarPrendas();
  }, []);

  const cargarPrendas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/prendas/');
      setPrendas(response.data);
    } catch (err) {
      setError('Error al cargar las prendas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorito = (prendaId) => {
    if (!requireAuth('agregar a favoritos')) { return;}

    const nuevosFavoritos = new Set(favoritos);
    if (nuevosFavoritos.has(prendaId)) {
      nuevosFavoritos.delete(prendaId);
    } else {
      nuevosFavoritos.add(prendaId);
    }
    setFavoritos(nuevosFavoritos);
  };
  const verDetalles = (prendaId) => {
    navigate(`/product/${prendaId}`); // Navega a la página de detalles del producto
  }

  if (loading) {
    return (
      <div className="marketplace-bg min-vh-100">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="text-center">
            <div className="spinner-border loading-spinner" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted fw-semibold">Cargando productos...</p>
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
      {/* Navbar */}
      <Navbar />

      {/* Banner */}
      <Banner />

      {/* Categories */}
      <div className="container my-5">
        <h2 className="section-header">Explorar Categorías</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="category-card">
              <div className="category-icon text-white">
                <i className="bi bi-gender-female"></i>
              </div>
              <h5 className="category-title">Mujer</h5>
              <p className="text-muted mb-0">Moda femenina</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="category-card">
              <div className="category-icon text-white">
                <i className="bi bi-gender-male"></i>
              </div>
              <h5 className="category-title">Hombre</h5>
              <p className="text-muted mb-0">Estilos masculinos</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="category-card">
              <div className="category-icon text-white">
                <i className="bi bi-balloon"></i>
              </div>
              <h5 className="category-title">Niños</h5>
              <p className="text-muted mb-0">Ropa infantil</p>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Destacados */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-header mb-0">Productos Destacados</h2>
          <button className="btn product-btn product-btn-outline">
            Ver todo <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>

        <div className="row g-4">
          {prendas.map((prenda) => (
            <div key={prenda.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
              <div className="product-card w-100">
                <img 
                  src={`http://localhost:8082/static/imagenes/${prenda.ruta_imagen.split('/').pop()}`}
                  className="product-image"
                  alt={prenda.descripcion}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+No+Disponible';
                  }}
                />
                <div className="card-body">
                  <h5 className="product-title">{prenda.descripcion}</h5>
                  <p className="product-category">
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
                      <button 
                        className="btn product-btn product-btn-outline"
                        onClick={() => verDetalles(prenda.id)} // Cambiado para usar la función
                      >
                        <i className="bi bi-eye me-2"></i>
                        Detalles
                      </button>
                      <button 
                        className={`btn product-btn ${favoritos.has(prenda.id) ? 'favorite-btn' : 'product-btn-outline'}`}
                        onClick={() => toggleFavorito(prenda.id)}
                      >
                        <i className={`bi ${favoritos.has(prenda.id) ? 'bi-star-fill' : 'bi-star'} me-2`}></i>
                        {favoritos.has(prenda.id) ? 'En Favoritos' : 'Favoritos'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Marketplace;