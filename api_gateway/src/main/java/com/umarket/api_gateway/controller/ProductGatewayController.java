package com.umarket.api_gateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class ProductGatewayController {

    @Autowired
    private WebClient.Builder webClientBuilder;

    private final String productServiceUrl = "http://localhost:8081/api/products";
    private final String categoryServiceUrl = "http://localhost:8081/api/categories";

    // Obtener productos
    @GetMapping("/products")
    public Mono<Object> getProducts(@RequestParam(required = false) String filter) {
        String url = productServiceUrl + (filter != null ? "?filter=" + filter : "");
        return webClientBuilder.build()
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(Object.class);
    }

    // Buscar productos
    @GetMapping("/products/search")
    public Mono<Object> searchProducts(@RequestParam String name) {
        String url = productServiceUrl + "/search?name=" + name;
        return webClientBuilder.build()
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(Object.class);
    }

    // Obtener categorías
    @GetMapping("/categories")
    public Mono<Object> getCategories() {
        return webClientBuilder.build()
                .get()
                .uri(categoryServiceUrl)
                .retrieve()
                .bodyToMono(Object.class);
    }
}