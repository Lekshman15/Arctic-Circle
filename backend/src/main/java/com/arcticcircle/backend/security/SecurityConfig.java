package com.arcticcircle.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/products/**").permitAll()
                // Admin only endpoints
                .requestMatchers("/api/orders").hasRole("ADMIN")
                .requestMatchers("/api/orders/*/deliver").hasRole("ADMIN")
                .requestMatchers("/api/tickets").hasRole("ADMIN")
                .requestMatchers("/api/tickets/*/complete").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/products").hasRole("ADMIN")
                // Customer only endpoints
                .requestMatchers("/api/orders/my").hasRole("CUSTOMER")
                .requestMatchers("/api/tickets/my").hasRole("CUSTOMER")
                // Everything else needs authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}