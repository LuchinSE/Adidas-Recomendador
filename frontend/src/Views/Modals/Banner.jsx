import React from 'react';
import BannerImg from '../../img/Nuevas prendas de temporada.png';

const Banner = () => {
  return (
    <div className="banner-section py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="banner-content">
              <h1 className="banner-title mb-3">
                Descubre las <span style={{ color: 'var(--burgundy-primary)' }}>Mejores Prendas</span> de la Temporada
              </h1>
              <p className="banner-text mb-4">
                Encuentra prendas exclusivas y a buen precio. 
                Calidad premium y diseños únicos para tu estilo.
              </p>
              <div className="banner-stats d-flex gap-4 mb-4">
                <div className="stat-item text-center">
                  <div className="stat-number fw-bold fs-3" style={{ color: 'var(--burgundy-primary)' }}>
                    500+
                  </div>
                  <div className="stat-label text-muted">Productos</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-number fw-bold fs-3" style={{ color: 'var(--burgundy-primary)' }}>
                    95%
                  </div>
                  <div className="stat-label text-muted">Clientes Satisfechos</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-number fw-bold fs-3" style={{ color: 'var(--burgundy-primary)' }}>
                    24/7
                  </div>
                  <div className="stat-label text-muted">Soporte</div>
                </div>
              </div>
              <button className="btn banner-btn btn-lg text-white px-4 py-2">
                Explorar Colección
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="banner-image text-center position-relative">
              <div 
                className="rounded-4 mx-auto position-relative"
                style={{
                  width: '100%',
                  height: '300px',
                  background: 'linear-gradient(135deg, var(--burgundy-light) 0%, var(--purple-light) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={BannerImg} 
                  alt="Nuevas prendas de temporada" 
                  className="img-fluid h-100"
                    style={{ objectFit: 'cover', borderRadius: '15px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;