package com.ocp.ecommerce.config;

import com.ocp.ecommerce.model.Role;
import com.ocp.ecommerce.model.User;
import com.ocp.ecommerce.repository.RoleRepository;
import com.ocp.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
                roleRepository.save(new Role("ROLE_ADMIN"));
            }
            if (roleRepository.findByName("ROLE_ASSOCIATION").isEmpty()) {
                roleRepository.save(new Role("ROLE_ASSOCIATION"));
            }
            // Ajouter un rôle utilisateur classique
            if (roleRepository.findByName("ROLE_USER").isEmpty()) {
                roleRepository.save(new Role("ROLE_USER"));
            }
            if (roleRepository.findByName("ROLE_EMPLOYE").isEmpty()) {
                roleRepository.save(new Role("ROLE_EMPLOYE"));
            }

        };
    }

    @Bean
    public CommandLineRunner createAdmin(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            // Vérifier avec le même email que celui qu'on va créer
            String adminEmail = "ikramadmin@ocp.com";
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                        .orElseThrow(() -> new RuntimeException("ROLE_ADMIN manquant"));

                User admin = new User();
                admin.setFirstName("Ikram");
                admin.setLastName("Elh");
                admin.setEmail(adminEmail);
                admin.setPassword(encoder.encode("admin123")); // mot de passe hashé
                admin.getRoles().add(adminRole);

                userRepository.save(admin);
                System.out.println("Admin créé avec succès !");
            } else {
                System.out.println("Admin déjà présent, pas de création.");
            }
        };
    }


}

