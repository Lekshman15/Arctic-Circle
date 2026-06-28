package com.arcticcircle.backend.service;

import com.arcticcircle.backend.dto.AuthResponse;
import com.arcticcircle.backend.dto.LoginRequest;
import com.arcticcircle.backend.dto.RegisterRequest;
import com.arcticcircle.backend.model.Admin;
import com.arcticcircle.backend.model.User;
import com.arcticcircle.backend.repository.AdminRepository;
import com.arcticcircle.backend.repository.UserRepository;
import com.arcticcircle.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        // Step 1 — Check admin table first
        Admin admin = adminRepository.findByEmail(request.getEmail()).orElse(null);
        if (admin != null && passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            String token = jwtUtil.generateToken(
                    admin.getAdminId().toString(),
                    admin.getEmail(),
                    "ADMIN"
            );
            return AuthResponse.builder()
                    .token(token)
                    .role("ADMIN")
                    .name(admin.getName())
                    .email(admin.getEmail())
                    .build();
        }

        // Step 2 — Check users table
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getUserId().toString(),
                user.getEmail(),
                "CUSTOMER"
        );

        return AuthResponse.builder()
                .token(token)
                .role("CUSTOMER")
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(
                savedUser.getUserId().toString(),
                savedUser.getEmail(),
                "CUSTOMER"
        );

        return AuthResponse.builder()
                .token(token)
                .role("CUSTOMER")
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .build();
    }
}