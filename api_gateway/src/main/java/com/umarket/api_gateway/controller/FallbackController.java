package com.umarket.api_gateway.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class FallbackController {
    @GetMapping("/fallback/user-service")
    public ResponseEntity<Map<String, Object>> userServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", 503);
        response.put("error", "Service Unaviable");
        response.put("message", "Servicio de usuario no disponible por ahora. Intenta de nuevo mas tarde");
        response.put("path", "/api/usuarios");
        return ResponseEntity.status(503).body(response);
    }

    @GetMapping("/fallback/clothing-service")
    public ResponseEntity<Map<String, Object>> closingServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", 503);
        response.put("error", "Service Unaviable");
        response.put("message", "Clothing-service no disponible temporalmente");

        return ResponseEntity.status(503).body(response);
    }

    @GetMapping("/fallback/auth-service")
    public ResponseEntity<Map<String, Object>> authServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", 503);
        response.put("error", "Service Unaviable");
        response.put("message", "Auth service no disponible temporalmente");

        return ResponseEntity.status(503).body(response);
    }

    @GetMapping("/fallback/classification-service")
    public ResponseEntity<Map<String, Object>> classificationServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", 503);
        response.put("error", "Service Unavailable");
        response.put("message", "Classification service no disponible temporalmente.");

        return ResponseEntity.status(503).body(response);
    }

    @GetMapping("/fallback/recommendation-service")
    public ResponseEntity<Map<String, Object>> recommendationServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", 503);
        response.put("error", "Service Unavailable");
        response.put("message", "Recommendation service no disponible temporalmente.");

        return ResponseEntity.status(503).body(response);
    }

    @GetMapping("/fallback/favorites-service")
    public ResponseEntity<Map<String, Object>> favoritesServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", 503);
        response.put("error", "Service Unavailable");
        response.put("message", "Favorites service no disponible temporalmente.");

        return ResponseEntity.status(503).body(response);
    }


}
