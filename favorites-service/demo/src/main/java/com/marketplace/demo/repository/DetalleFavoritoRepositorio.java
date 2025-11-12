package com.marketplace.demo.repository;

import com.marketplace.demo.entity.DetalleFavorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DetalleFavoritoRepositorio extends JpaRepository<DetalleFavorito, Long> {
    //Listar favoritos
    List<DetalleFavorito> findByFavoritoId(Long id);
    @Query("SELECT df.idProducto FROM DetalleFavorito df WHERE df.favorito.idCliente = :idCliente")
    List<Long> findProductoIdsByFavoritoIdCliente(@Param("idCliente") Long idCliente);

    //Buscar existencia
    boolean existsByFavoritoIdClienteAndIdProducto(Long idCliente, Long idProducto);

    //Eliminar de favoritos
    @Modifying
    @Query("DELETE FROM DetalleFavorito df WHERE df.favorito.idCliente = :idCliente AND df.idProducto = :idProducto")
    void deleteByClienteAndProducto(@Param("idCliente") Long idCliente, @Param("idProducto") Long idProducto);

    //Contar favoritos de cliente
    int countByFavoritoIdCliente(Long idCliente);

}
