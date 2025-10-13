import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-3">
              <div className="volcano-icon me-3" style={{ width: '40px', height: '40px', borderRadius: '10px' }}>
                <i className="bi bi-volcano"></i>
              </div>
              <h5 className="mb-0 fw-bold">AQP Marketplace</h5>
            </div>
            <p className="text-muted mb-0">
              Tu destino para encontrar las mejores prendas y accesorios.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="mb-3">
              <a href="#" className="text-white me-3">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-white me-3">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-whatsapp fs-5"></i>
              </a>
            </div>
            <p className="text-muted mb-0">
              &copy; 2024 AQP Marketplace. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;