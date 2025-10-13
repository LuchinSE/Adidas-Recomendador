import React, { useState, useEffect } from 'react';
import authService from '../Service/authService';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Obtener información de usuarios activos
        const usersData = await authService.getUserInfo();
        if (usersData) {
          setUsersList(usersData);
          
          // Buscar el usuario actual en la lista
          const currentUser = authService.getUser();
          if (currentUser && currentUser.email) {
            const userFromList = usersData.find(u => u.correo === currentUser.email);
            if (userFromList) {
              setUser(userFromList);
            }
          }
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-md-8">
          <div className="card text-center">
            <div className="card-body p-5">
              <div className="text-success mb-4">
                <h1>✅</h1>
              </div>
              
              <h1 className="text-success mb-4">¡Felicidades!</h1>
              <p className="lead mb-4">Te has autenticado correctamente con el backend.</p>
              
              {user && (
                <div className="mb-4 p-3 bg-white rounded shadow-sm">
                  <h5>Tu información:</h5>
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.correo}</p>
                  {user.nombre && <p><strong>Nombre:</strong> {user.nombre}</p>}
                </div>
              )}

              <div className="mb-4">
                <h6>Usuarios activos en el sistema:</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Nombre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map(usuario => (
                        <tr key={usuario.id}>
                          <td>{usuario.id}</td>
                          <td>{usuario.correo}</td>
                          <td>{usuario.nombre || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;