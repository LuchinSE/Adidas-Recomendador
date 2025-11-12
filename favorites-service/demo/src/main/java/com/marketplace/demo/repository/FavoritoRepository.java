package com.marketplace.demo.repository;

import com.marketplace.demo.entity.Favorito;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface FavoritoRepository extends CrudRepository<Favorito, Long> {
    Optional<Favorito> findByIdCliente(Long idCliente);
    boolean existsByIdCliente(Long idCliente);
}
