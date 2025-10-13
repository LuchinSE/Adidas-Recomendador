import axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:8080';

const authService = {
  login: async (email, password) => {
    try {
      console.log("🔄 Attempting login with:", email);
      
      const response = await axios.post(`${API_GATEWAY_URL}/login`, {
        email: email,
        password: password
      }, {
        timeout: 10000
      });
      
      console.log("✅ Login successful:", {
        token: response.data.access_token ? "PRESENT" : "MISSING",
        user: response.data.user
      });
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error("Login failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Authentication error';
      throw new Error(errorMessage);
    }
  },

  verifyToken: async () => {
    try {
      const token = authService.getToken();
      if (!token) return false;

      // Puedes implementar verificación con el backend si lo necesitas
      console.log("✅ Token exists:", token.slice(0, 20) + "...");
      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log("🚪 User logged out");
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getUserInfo: async () => {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/api/usuarios/activos`);
      return response.data;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }
};

export default authService;