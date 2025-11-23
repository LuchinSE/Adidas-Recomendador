package com.umarket.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import com.umarket.api_gateway.filters.LoggingFilter;
import com.umarket.api_gateway.filters.SecurityHeadersFilter;

import java.util.Arrays;

@Configuration
public class ApiGatewayConfig {

    private final LoggingFilter loggingFilter;
    private final SecurityHeadersFilter securityHeadersFilter;

    public ApiGatewayConfig(LoggingFilter loggingFilter, SecurityHeadersFilter securityHeadersFilter) {
        this.loggingFilter = loggingFilter;
        this.securityHeadersFilter = securityHeadersFilter;
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r
                        .path("/api/usuarios/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                                .filter(securityHeadersFilter.apply(new SecurityHeadersFilter.Config()))
                                .circuitBreaker(config -> config
                                        .setName("userServiceCB")
                                        .setFallbackUri("forward:/fallback/user-service"))
                                .retry(3)
                        )
                        .uri("http://localhost:8081")
                )
                .route("auth-service", r -> r
                        .path("/login")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                                .filter(securityHeadersFilter.apply(new SecurityHeadersFilter.Config()))
                                .circuitBreaker(config -> config
                                        .setName("authServiceCB")
                                        .setFallbackUri("forward:/fallback/auth-service"))
                        )
                        .uri("http://localhost:8083")
                )
                .route("clothing-service", r -> r
                        .path("/prendas/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                                .filter(securityHeadersFilter.apply(new SecurityHeadersFilter.Config()))
                                .circuitBreaker(config -> config
                                        .setName("clothingServiceCB")
                                        .setFallbackUri("forward:/fallback/clothing-service"))
                                .rewritePath("/api/prendas/(?<segment>.*)", "/api/${segment}")
                                .retry(2)
                        )
                        .uri("http://localhost:8082")
                )
                .route("classification-service", r -> r
                        .path("/api/classification/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                                .filter(securityHeadersFilter.apply(new SecurityHeadersFilter.Config()))
                                .circuitBreaker(config -> config
                                        .setName("classificationServiceCB")
                                        .setFallbackUri("forward:/fallback/classification-service"))
                        )
                        .uri("http://localhost:8084")
                )
                .route("recommendation-service", r -> r
                        .path("/api/recommendations/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                                .filter(securityHeadersFilter.apply(new SecurityHeadersFilter.Config()))
                                .circuitBreaker(config -> config
                                        .setName("recommendationServiceCB")
                                        .setFallbackUri("forward:/fallback/recommendation-service"))
                        )
                        .uri("http://localhost:8085")
                )
                .route("favorites-service", r -> r
                        .path("/favoritos/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                                .filter(securityHeadersFilter.apply(new SecurityHeadersFilter.Config()))
                                .circuitBreaker(config -> config
                                        .setName("favoritesServiceCB")
                                        .setFallbackUri("forward:/fallback/favorites-service"))
                        )
                        .uri("http://localhost:8086")
                )
                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        corsConfig.setExposedHeaders(Arrays.asList(
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                "X-Request-ID",
                "X-Gateway-Processed"
        ));
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}