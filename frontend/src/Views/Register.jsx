import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AlertModal from './Modals/AlertModal';
import '../css/AuthTheme.css';
import volcanImg from '../img/AqpMarketplace Logo Versión Invertida.png';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState({ show: false, title: '', message: '', type: '' });

  const showAlert = (title, message, type = 'success') => {
    setAlert({ show: true, title, message, type });
  };

  const closeAlert = () => {
    setAlert({ show: false, title: '', message: '', type: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      showAlert('Error', 'Las contraseñas no coinciden', 'error');
      setLoading(false);
      return;
    }

    if (formData.contrasena.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      showAlert('Error', 'La contraseña debe tener al menos 4 caracteres', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/usuarios/registro', {
        nombre: formData.nombre,
        correo: formData.correo,
        contrasena: formData.contrasena,
        estado: true
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      showAlert(
        '¡Cuenta creada!', 
        'Tu cuenta ha sido creada correctamente.', 
        'success'
      );
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          'Error al registrar usuario';
      setError(errorMessage);
      showAlert('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal 
        show={alert.show}
        onClose={closeAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />

      <div className="container-fluid aqp-bg">
        <div className="row justify-content-center align-items-center min-vh-100 py-4">
          <div className="col-12 col-sm-10 col-md-8 col-lg-7 col-xl-6">
            <div className="aqp-card p-5">
              
              {/* Logo y Título */}
              <div className="aqp-logo">
                <div className="volcano-icon p-0" style={{background: 'none', boxShadow: 'none'}}>
                  <img src={volcanImg} alt="Volcán" style={{width: '70px', height: '70px', objectFit: 'contain'}} />
                </div>
                <h1 className="aqp-title">AQP Marketplace</h1>
                <p className="aqp-subtitle">
                  Únete a nuestra comunidad y descubre productos únicos
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="aqp-form">
                
                {/* Nombre */}
                <div className="mb-4">
                  <label className="form-label">Nombre completo</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="mb-4">
                  <label className="form-label">Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      name="contrasena"
                      value={formData.contrasena}
                      onChange={handleChange}
                      placeholder="Mínimo 4 caracteres"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="mb-4">
                  <label className="form-label">Confirmar contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      name="confirmarContrasena"
                      value={formData.confirmarContrasena}
                      onChange={handleChange}
                      placeholder="Repite tu contraseña"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Botón de envío */}
                <button 
                  type="submit" 
                  className="btn aqp-btn-primary w-100 py-3 mb-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="aqp-loading me-2"></span>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Crear Cuenta
                    </>
                  )}
                </button>

              </form>

              {/* Enlace a login */}
              <div className="aqp-footer">
                <span className="text-muted">¿Ya tienes cuenta? </span>
                <Link to="/login" className="aqp-link">
                  Inicia sesión
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;