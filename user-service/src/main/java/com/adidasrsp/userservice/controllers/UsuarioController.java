package com.adidasrsp.userservice.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adidasrsp.userservice.models.UsuarioModel;
import com.adidasrsp.userservice.services.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    UsuarioService usuarioService;

    @GetMapping()
    public ArrayList<UsuarioModel> obtenerUsuarios(){
        return usuarioService.obtenerUsuarios();
    }

    @GetMapping("/activos")
    public List<UsuarioModel> obtenerUsuariosActivos(){
        return usuarioService.obtenerUsuariosActivos();
    }

    @GetMapping("/{id}")
    public Optional<UsuarioModel> obtenerPorId(@PathVariable("id") Long id){
        return usuarioService.obtenerPorId(id);
    }

    @PostMapping("/registro")
    public UsuarioModel guardarUsuario(@RequestBody UsuarioModel usuario){
        return this.usuarioService.guardarUsuario(usuario);
    }

    @DeleteMapping("/{id}")
    public void eliminarLogicamenteUsuario(@PathVariable("id") Long id){
        usuarioService.eliminarLogicamenteUsuario(id);
    }

}
