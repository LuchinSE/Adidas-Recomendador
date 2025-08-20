package com.adidasrsp.userservice.security;

import com.adidasrsp.userservice.models.UsuarioModel;
import com.adidasrsp.userservice.repository.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        UsuarioModel usuario = usuarioRepositorio.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        
        return new User(
                usuario.getCorreo(),
                usuario.getContrasena(),
                Collections.emptyList() // No roles por ahora
        );
    }
}