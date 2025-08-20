package com.adidasrsp.userservice.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.adidasrsp.userservice.models.UsuarioModel;
import com.adidasrsp.userservice.repository.UsuarioRepositorio;


@Service
public class UsuarioService {
    @Autowired
    UsuarioRepositorio usuarioRepositorio;
    @Autowired
    private PasswordEncoder passwordEncoder;  //Inyección 

    public ArrayList<UsuarioModel> obtenerUsuarios(){
        return(ArrayList<UsuarioModel>)usuarioRepositorio.findAll();
    }

    public List<UsuarioModel> obtenerUsuariosActivos(){
        return usuarioRepositorio.findByEstadoTrue();
    }

    public Optional<UsuarioModel> obtenerPorId(Long id){
        return usuarioRepositorio.findById(id);
    }
    
    public UsuarioModel guardarUsuario(UsuarioModel usuario){
        Optional<UsuarioModel> existente = usuarioRepositorio.findByCorreo(usuario.getCorreo());
        if(existente.isPresent()){
            throw new IllegalArgumentException("El correo ingresado ya existe");
        }
         // Hashear la contraseña antes de guardarla
        String passwordHasheada = passwordEncoder.encode(usuario.getContrasena());
        usuario.setContrasena(passwordHasheada);
        return usuarioRepositorio.save(usuario);
    }

    public boolean eliminarLogicamenteUsuario(Long id){
        Optional<UsuarioModel> usuarioOptional = usuarioRepositorio.findById(id);
        if(usuarioOptional.isPresent()){
            UsuarioModel usuario = usuarioOptional.get();
            usuario.setEstado(false);
            usuarioRepositorio.save(usuario);
            return true;
        }else{
            return false;
        }

    }
}
