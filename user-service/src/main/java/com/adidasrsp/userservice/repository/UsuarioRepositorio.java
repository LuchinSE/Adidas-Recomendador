package com.adidasrsp.userservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.adidasrsp.userservice.models.UsuarioModel;

@Repository
public interface UsuarioRepositorio extends CrudRepository<UsuarioModel, Long> {

List<UsuarioModel> findByEstadoTrue();
Optional<UsuarioModel> findByCorreo(String Correo);

}
