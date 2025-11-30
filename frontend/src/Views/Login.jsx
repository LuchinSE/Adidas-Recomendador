import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../Service/authService';
import AlertModal from './Modals/AlertModal';
import '../css/AuthTheme.css';
import volcanImg from '../img/AqpMarketplace Logo Versión Invertida.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState({ show: false, title: '', message: '', type: '' });
  const navigate = useNavigate();

  const showAlert = (title, message, type = 'success') => {
    setAlert({ show: true, title, message, type });
  };

  const closeAlert = () => {
    setAlert({ show: false, title: '', message: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(email, password);
      
      if (result.access_token) {
        showAlert(
          '¡Bienvenido!', 
          'Te has autenticado correctamente.', 
          'success'
        );
        setTimeout(() => {
          navigate('/marketplace');
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
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
                  Conéctate para gestionar tus favoritos, publicaciones y recomendaciones IA.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="aqp-form">
                
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Enlace olvidó contraseña */}
                <div className="mb-4 text-end">
                  <Link to="/forgot-password" className="aqp-link">
                    ¿Olvidaste tu contraseña?
                  </Link>
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
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Entrar
                    </>
                  )}
                </button>

              </form>

              {/* Enlace a registro */}
              <div className="aqp-footer">
                <span className="text-muted">¿No tienes una cuenta? </span>
                <Link to="/register" className="aqp-link">
                  Regístrate
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;