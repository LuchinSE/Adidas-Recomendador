package com.umarket.api_gateway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration
@EnableWebFlux
public class WebConfig implements WebFluxConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Permitir solicitudes de todos los métodos desde localhost:5173
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")  // Cambia esto si es necesario
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")  // Permite cualquier encabezado
                .allowCredentials(true);  // Permite credenciales como cookies
    }
}