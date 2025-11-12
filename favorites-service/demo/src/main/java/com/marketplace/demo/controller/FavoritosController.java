package com.marketplace.demo.controller;

import com.marketplace.demo.service.FavoritosService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favoritos")
@RequiredArgsConstructor
@Tag(name="Favoritos", description = "Api para gestionar productos favoritos de los clientes")
public class FavoritosController {

    private static final Logger logger = LoggerFactory.getLogger(FavoritosController.class);

    @Autowired
    private final FavoritosService favoritosService;

    @PostMapping("/cliente/{idCliente}")
    @Operation(summary = "Crear favorito para cliente")
    public ResponseEntity<String> crearFavorito(@PathVariable long idCliente) {
        try {
            logger.info("INICIO - Crear favorito para cliente {}", idCliente);

            favoritosService.crearFavoritoAutomatico(idCliente);

            logger.info("EXITO - Favorito creado para cliente {}", idCliente);
            return ResponseEntity.ok("Favorito creado automáticamente");

        } catch (Exception e) {
            logger.error("ERROR - No se pudo crear favorito para cliente {}: {}", idCliente, e.getMessage());
            return ResponseEntity.internalServerError().body("Error al crear favorito: " + e.getMessage());
        }
    }

    @PostMapping("/cliente/{idCliente}/producto/{idProducto}")
    @Operation(summary = "Agregar producto a favoritos")
    public ResponseEntity<String> agregarProducto(
            @PathVariable long idCliente,
            @PathVariable long idProducto) {
        try {
            logger.info("INICIO - Agregar producto {} a favoritos del cliente {}", idProducto, idCliente);

            favoritosService.agregarProductoFavorito(idCliente, idProducto);

            logger.info("EXITO - Producto {} agregado a favoritos del cliente {}", idProducto, idCliente);
            return ResponseEntity.ok("Producto agregado a favoritos");

        } catch (RuntimeException e) {
            logger.warn("ADVERTENCIA - No se pudo agregar producto {} a favoritos del cliente {}: {}",
                    idProducto, idCliente, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERROR - No se pudo agregar producto {} a favoritos del cliente {}: {}",
                    idProducto, idCliente, e.getMessage());
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    @DeleteMapping("/clientes/{idCliente}/productos/{idProducto}")
    @Operation(summary = "Eliminar producto de favoritos")
    public ResponseEntity<String> eliminarProducto(
            @PathVariable long idCliente,
            @PathVariable long idProducto){
        try {
            logger.info("INICIO - Eliminar producto {} de favoritos del cliente {}", idProducto, idCliente);

            favoritosService.eliminarProductoFavorito(idCliente, idProducto);

            logger.info("EXITO - Producto {} eliminado de favoritos del cliente {}", idProducto, idCliente);
            return ResponseEntity.ok("Producto eliminado de favoritos");

        } catch (Exception e) {
            logger.error("ERROR - No se pudo eliminar producto {} de favoritos del cliente {}: {}",
                    idProducto, idCliente, e.getMessage());
            return ResponseEntity.internalServerError().body("Error al eliminar producto de favoritos");
        }
    }

    @GetMapping("/clientes/{idCliente}/productos")
    @Operation(summary = "Obtener IDs de productos favoritos")
    public ResponseEntity<List<Long>> obtenerIdsFavoritos(@PathVariable Long idCliente) {
        try {
            logger.info("INICIO - Obtener IDs de productos favoritos para cliente {}", idCliente);

            List<Long> ids = favoritosService.obtenerIdsProductosFavoritos(idCliente);

            logger.info("EXITO - Se obtuvieron {} productos favoritos para cliente {}", ids.size(), idCliente);
            return ResponseEntity.ok(ids);

        } catch (Exception e) {
            logger.error("ERROR - No se pudieron obtener productos favoritos para cliente {}: {}",
                    idCliente, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/clientes/{idCliente}/cantidad")
    @Operation(summary = "Obtener cantidad de productos favoritos")
    public ResponseEntity<Integer> obtenerCantidadFavoritos(@PathVariable Long idCliente) {
        try {
            logger.info("INICIO - Obtener cantidad de favoritos para cliente {}", idCliente);

            int cantidad = favoritosService.contarFavoritos(idCliente);

            logger.info("EXITO - Cliente {} tiene {} productos favoritos", idCliente, cantidad);
            return ResponseEntity.ok(cantidad);

        } catch (Exception e) {
            logger.error("ERROR - No se pudo obtener cantidad de favoritos para cliente {}: {}",
                    idCliente, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}