import React from 'react';

const AlertModal = ({ show, onClose, title, message, type = 'info' }) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi bi-check-circle-fill text-success';
      case 'error':
        return 'bi bi-exclamation-triangle-fill text-danger';
      case 'warning':
        return 'bi bi-exclamation-circle-fill text-warning';
      default:
        return 'bi bi-info-circle-fill text-primary';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-success';
      case 'error':
        return 'border-danger';
      case 'warning':
        return 'border-warning';
      default:
        return 'border-primary';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-danger';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-dark';
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content border-2 ${getBorderColor()} shadow-lg`} style={{ borderRadius: '16px' }}>
          
          {/* Header minimalista */}
          <div className="modal-header border-0 pb-2">
            <div className="d-flex align-items-center w-100">
              <i className={`${getIcon()} me-3 fs-5`}></i>
              <h6 className="modal-title mb-0 fw-bold fs-6">{title}</h6>
              <button 
                type="button" 
                className="btn-close ms-auto" 
                onClick={onClose}
                style={{ fontSize: '0.7rem' }}
              ></button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body py-3">
            <p className={`mb-0 ${getTextColor()} fs-6`}>{message}</p>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 pt-0">
            <button 
              type="button" 
              className="btn aqp-btn-primary px-4 py-2" 
              onClick={onClose}
              style={{ 
                borderRadius: '10px',
                fontSize: '0.9rem'
              }}
            >
              Aceptar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AlertModal;