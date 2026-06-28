package com.arcticcircle.backend.service;

import com.arcticcircle.backend.model.Admin;
import com.arcticcircle.backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements ApplicationRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (adminRepository.count() == 0) {
            Admin admin = Admin.builder()
                    .name("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .build();

            adminRepository.save(admin);
            System.out.println("Admin account seeded: " + adminEmail);
        } else {
            System.out.println("Admin account already exists — skipping seed");
        }
    }
}