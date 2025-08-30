package com.ocp.ecommerce.controller;

import com.ocp.ecommerce.dto.UserDto;
import com.ocp.ecommerce.model.Role;
import com.ocp.ecommerce.model.User;
import com.ocp.ecommerce.repository.RoleRepository;
import com.ocp.ecommerce.service.IUserService;
import com.ocp.ecommerce.config.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto,
                                      @AuthenticationPrincipal OAuth2User oauthUser) {

        String email;
        String uid;

        if (oauthUser != null) {
            email = oauthUser.getAttribute("email");
            uid = oauthUser.getName(); // identifiant unique OAuth2
        } else {
            email = userDto.getEmail();
            uid = null;
        }

        if (userService.existsByEmail(email)) {
            return ResponseEntity.status(400).body(Map.of("message", "Email déjà utilisé"));
        }

        // Création du user
        User user = new User();
        user.setEmail(email);
        user.setUid(uid);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        // ⚡ Attribution du rôle correct
        Role role;
        if (email.endsWith("@ocp.com")) { // employés OCP
            role = roleRepository.findByName("ROLE_EMPLOYE").orElseThrow();
        } else { // utilisateurs classiques
            role = roleRepository.findByName("ROLE_USER").orElseThrow();
        }
        user.setRoles(Set.of(role));

        // Sauvegarde
        User savedUser = userService.updateUser(user);

        return ResponseEntity.ok(savedUser);
    }


    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String email;
        try {
            email = jwtUtils.getEmailFromJwt(token); // Décode ton JWT
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Token invalide"));
        }

        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Utilisateur introuvable"));
        }

        String role = user.getRoles().stream()
                .map(r -> r.getName().toLowerCase())
                .findFirst()
                .orElse("role_association"); // ⚡ valeur par défaut

        Map<String, Object> response = new HashMap<>();
        response.put("uid", user.getUid());
        response.put("email", user.getEmail());
        response.put("role", role);

        return ResponseEntity.ok(response);
    }


    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) return ResponseEntity.notFound().build();
        UserDto dto = userService.convertToDto(user);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/type/{uid}")
    public ResponseEntity<?> getUserType(@PathVariable String uid) {
        User user = userService.findByUid(uid);
        if (user == null) return ResponseEntity.status(404).body(Map.of("message", "Compte inexistant"));

        String role = user.getRoles().stream()
                .map(r -> r.getName().toLowerCase())
                .filter(r -> r.equals("role_admin") || r.equals("role_employe") || r.equals("role_association"))
                .findFirst()
                .orElse("unknown");

        return ResponseEntity.ok(Map.of("type", role.replace("role_", "")));
    }

    @PostMapping("/login-employe")
    public ResponseEntity<?> loginEmploye(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body(Map.of("message", "Compte inexistant"));
        if (!passwordEncoder.matches(password, user.getPassword()))
            return ResponseEntity.status(401).body(Map.of("message", "Mot de passe incorrect"));
        if (!email.endsWith("@ocp.com"))
            return ResponseEntity.status(400).body(Map.of("message", "Email invalide pour un employé OCP"));

        if (user.getUid() == null || user.getUid().isEmpty()) {
            user.setUid(UUID.randomUUID().toString());
            userService.updateUser(user);
        }

        // ⚡ Assurer que l'utilisateur a le rôle EMPLOYE
        if (user.getRoles().stream().noneMatch(r -> r.getName().equals("ROLE_EMPLOYE"))) {
            Role employeRole = roleRepository.findByName("ROLE_EMPLOYE").orElseThrow();
            user.setRoles(Set.of(employeRole));
            userService.updateUser(user);
        }

        // Générer JWT
        String token = jwtUtils.generateJwtToken(email);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Connexion réussie");
        response.put("uid", user.getUid());
        response.put("role", "ROLE_EMPLOYE");
        response.put("token", token);

        return ResponseEntity.ok(response);
    }


    // 🔹 Login utilisateur classique (email/password)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body(Map.of("message", "Compte inexistant"));
        if (!passwordEncoder.matches(password, user.getPassword()))
            return ResponseEntity.status(401).body(Map.of("message", "Mot de passe incorrect"));

        if (user.getUid() == null || user.getUid().isEmpty()) {
            user.setUid(UUID.randomUUID().toString());
            userService.updateUser(user);
        }

        // Générer le token JWT
        String token = jwtUtils.generateJwtToken(email);

        Map<String, Object> response = new HashMap<>();
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .toList(); // Java 16+ ou collect(Collectors.toList()) pour Java <16

        response.put("roles", roleNames); // ⚠ note le pluriel
        response.put("token", token);
        response.put("uid", user.getUid());

        return ResponseEntity.ok(response);
    }


    // 🔹 Mise à jour du UID
    @PutMapping("/{id}/uid")
    public ResponseEntity<User> updateUserUid(@PathVariable Long id, @RequestBody String uid) {
        User user = userService.getUserById(id);
        if (user == null) return ResponseEntity.notFound().build();

        user.setUid(uid);
        userService.updateUser(user);
        return ResponseEntity.ok(user);
    }

}
