package com.arcticcircle.backend.controller;

import com.arcticcircle.backend.model.User;
import com.arcticcircle.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Get current user profile
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.getProfile(email);
            return ResponseEntity.ok(Map.of(
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "phone", user.getPhone() != null ? user.getPhone() : "",
                    "address", user.getAddress() != null ? user.getAddress() : ""
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update address and phone
    @PutMapping("/me/address")
    public ResponseEntity<?> updateAddress(
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            String address = body.get("address");
            String phone = body.get("phone");
            User updated = userService.updateAddress(email, address, phone);
            return ResponseEntity.ok(Map.of(
                    "name", updated.getName(),
                    "email", updated.getEmail(),
                    "phone", updated.getPhone() != null ? updated.getPhone() : "",
                    "address", updated.getAddress() != null ? updated.getAddress() : ""
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Change password
    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            String currentPassword = body.get("currentPassword");
            String newPassword = body.get("newPassword");
            userService.changePassword(email, currentPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}