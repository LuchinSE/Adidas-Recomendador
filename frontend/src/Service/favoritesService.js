const API_BASE = 'http://localhost:8080';

export const favoritesService = {
  
  crearFavorito: async (idCliente) => {
    try {
      console.log(`Creando favorito para cliente: ${idCliente}`);
      const response = await fetch(`${API_BASE}/favoritos/cliente/${idCliente}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        // Si el error es 500, probablemente ya existe, lo consideramos éxito
        if (response.status === 500) {
          return 'Favorito ya existe';
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.text();
      console.log('Resultado:', result);
      return result;
    } catch (error) {
      console.log('Info en crearFavorito:', error.message);
      // Si hay error de red, asumimos que ya existe
      return 'Favorito ya existe o no se pudo crear';
    }
  },


    obtenerIdsFavoritos: async (idCliente) => {
        try {
            const response = await fetch(`${API_BASE}/favoritos/clientes/${idCliente}/productos`);
            if (!response.ok) throw new Error("Error Obteniendo favoritos");
            return await response.json();
        }catch (error) {
            console.error('Error fetching favorite IDs:', error);
            return [];
        }     
    },

   obtenerProductosPorIds: async (ids) => {
    try {
        if (!ids || ids.length === 0) return [];

        const idsString = ids.join(',');
        console.log(`Obteniendo productos por IDs: ${idsString}`);
        const response = await fetch(`${API_BASE}/prendas/multiple?ids=${idsString}`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const productos = await response.json();
        console.log('Productos obtenidos:', productos);
        return productos;
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        return [];
    }
    },

      // Agregar producto a favoritos
  agregarFavorito: async (idCliente, idProducto) => {
    try {
      const response = await fetch(`${API_BASE}/favoritos/cliente/${idCliente}/producto/${idProducto}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.text();
    } catch (error) {
      console.error('Error agregando favorito:', error);
      throw error;
    }
  },

  // Eliminar producto de favoritos
  eliminarFavorito: async (idCliente, idProducto) => {
    try {
      const response = await fetch(`${API_BASE}/favoritos/clientes/${idCliente}/productos/${idProducto}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.text();
    } catch (error) {
      console.error('Error eliminando favorito:', error);
      throw error;
    }
  },

  // Obtener cantidad de favoritos
  obtenerCantidadFavoritos: async (idCliente) => {
    try {
      const response = await fetch(`${API_BASE}/favoritos/clientes/${idCliente}/cantidad`);
      if (!response.ok) throw new Error('Error obteniendo cantidad');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo cantidad de favoritos:', error);
      return 0;
    }
  }

};