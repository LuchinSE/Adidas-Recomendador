package com.marketplace.demo.service;

import com.marketplace.demo.entity.DetalleFavorito;
import com.marketplace.demo.entity.Favorito;
import com.marketplace.demo.repository.DetalleFavoritoRepositorio;
import com.marketplace.demo.repository.FavoritoRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoritosService {

    private static final Logger logger = LoggerFactory.getLogger(FavoritosService.class);

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private DetalleFavoritoRepositorio detalleFavoritoRepositorio;

    @Transactional
    public void crearFavoritoAutomatico(Long idCliente) {
        try {
            boolean existe = favoritoRepository.existsByIdCliente(idCliente);
            if(!existe) {
                logger.info("Creando NUEVO favorito para cliente: {}", idCliente);
                Favorito favorito = new Favorito();
                favorito.setIdCliente(idCliente);

                Favorito favoritoGuardado = favoritoRepository.save(favorito);
                logger.info("Favorito CREADO exitosamente con ID: {} para cliente: {}",
                        favoritoGuardado.getId(), idCliente);
            } else {
                logger.info("Favorito YA EXISTE para cliente: {}", idCliente);
            }

        } catch (Exception e) {
            logger.error("ERROR CRÍTICO al crear favorito para cliente {}: {}", idCliente, e.getMessage(), e);
            throw new RuntimeException("Error al crear favorito: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void agregarProductoFavorito(Long idCliente, Long idProducto) {
        try {
            logger.info("Agregando producto {} a favoritos del cliente {}", idProducto, idCliente);

            Favorito favorito = favoritoRepository.findByIdCliente(idCliente)
                    .orElseThrow(()-> {
                        logger.error("Favorito no encontrado para el cliente: {}", idCliente);
                        return new RuntimeException("Favorito no encontrado para el cliente");
                    });

            if(detalleFavoritoRepositorio.existsByFavoritoIdClienteAndIdProducto(idCliente, idProducto)) {
                logger.warn("El producto {} ya está en favoritos del cliente {}", idProducto, idCliente);
                throw new RuntimeException("El producto ya esta en favoritos");
            }

            DetalleFavorito detalle = new DetalleFavorito();
            detalle.setIdProducto(idProducto);
            detalle.setFavorito(favorito);
            detalleFavoritoRepositorio.save(detalle);

            logger.info("Producto {} agregado exitosamente a favoritos del cliente {}", idProducto, idCliente);

        } catch (RuntimeException e) {
            logger.error("Error al agregar producto {} a favoritos del cliente {}: {}",
                    idProducto, idCliente, e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error inesperado al agregar producto {} a favoritos del cliente {}: {}",
                    idProducto, idCliente, e.getMessage(), e);
            throw new RuntimeException("Error interno del servidor", e);
        }
    }

    @Transactional
    public void eliminarProductoFavorito(Long idCliente, Long idProducto) {
        try {
            logger.info("Eliminando producto {} de favoritos del cliente {}", idProducto, idCliente);

            detalleFavoritoRepositorio.deleteByClienteAndProducto(idCliente, idProducto);

            logger.info("Producto {} eliminado exitosamente de favoritos del cliente {}", idProducto, idCliente);

        } catch (Exception e) {
            logger.error("Error al eliminar producto {} de favoritos del cliente {}: {}",
                    idProducto, idCliente, e.getMessage(), e);
            throw new RuntimeException("Error al eliminar producto de favoritos", e);
        }
    }

    @Transactional(readOnly = true)
    public List<Long> obtenerIdsProductosFavoritos(Long idCliente) {
        try {
            logger.debug("Obteniendo IDs de productos favoritos para cliente: {}", idCliente);

            List<Long> productos = detalleFavoritoRepositorio.findProductoIdsByFavoritoIdCliente(idCliente);

            logger.debug("Se encontraron {} productos favoritos para cliente: {}", productos.size(), idCliente);
            return productos;

        } catch (Exception e) {
            logger.error("Error al obtener productos favoritos para cliente {}: {}", idCliente, e.getMessage(), e);
            throw new RuntimeException("Error al obtener productos favoritos", e);
        }
    }

    @Transactional(readOnly = true)
    public boolean esProductoFavorito(Long idCliente, Long idProducto) {
        try {
            logger.debug("Verificando si producto {} es favorito del cliente {}", idProducto, idCliente);

            boolean esFavorito = detalleFavoritoRepositorio.existsByFavoritoIdClienteAndIdProducto(idCliente, idProducto);

            logger.debug("Producto {} es favorito del cliente {}: {}", idProducto, idCliente, esFavorito);
            return esFavorito;

        } catch (Exception e) {
            logger.error("Error al verificar si producto {} es favorito del cliente {}: {}",
                    idProducto, idCliente, e.getMessage(), e);
            throw new RuntimeException("Error al verificar producto favorito", e);
        }
    }

    @Transactional(readOnly = true)
    public int contarFavoritos(Long idCliente) {
        try {
            logger.debug("Contando favoritos para cliente: {}", idCliente);

            int cantidad = detalleFavoritoRepositorio.countByFavoritoIdCliente(idCliente);

            logger.debug("Cliente {} tiene {} productos favoritos", idCliente, cantidad);
            return cantidad;

        } catch (Exception e) {
            logger.error("Error al contar favoritos para cliente {}: {}", idCliente, e.getMessage(), e);
            throw new RuntimeException("Error al contar favoritos", e);
        }
    }
}