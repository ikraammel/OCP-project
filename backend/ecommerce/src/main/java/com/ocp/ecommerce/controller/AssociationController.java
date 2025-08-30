package com.ocp.ecommerce.controller;

import com.ocp.ecommerce.model.Association;
import com.ocp.ecommerce.service.IAssociationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/association")
public class AssociationController {

    @Autowired
    private IAssociationService associationService;

    // Obtenir toutes les associations
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Association>> getAllAssociations() {
        return ResponseEntity.ok(associationService.getAllAssociations());
    }

    @PostMapping("/new")
    @PreAuthorize("hasRole('ASSOCIATION')")
    public ResponseEntity<?> createAssociation(
            @RequestBody Association association,
            Authentication authentication) {

        String email = authentication.getName(); // ou ((UserDetails) authentication.getPrincipal()).getUsername()
        System.out.println("Création association par: " + email);

        // si tu veux vérifier l’UID par rapport à ton modèle:
        // String uid = authentication.getName(); // ou autre champ de ton JWT

        association.setProfileCompleted(
                association.getName() != null && !association.getName().isEmpty() &&
                        association.getDescription() != null && !association.getDescription().isEmpty() &&
                        association.getAdresse() != null && !association.getAdresse().isEmpty() &&
                        association.getContact() != null && !association.getContact().isEmpty()
        );

        Association savedAssoc = associationService.createAssociation(association, email);
        return ResponseEntity.ok(savedAssoc);
    }


    // Mettre à jour son propre profil
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateOwnProfile(
            @RequestBody Association updatedAssociation,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Accès refusé"));
        }

        String uid = authentication.getName(); // récupère l'email ou l'UID selon ton JWT
        Optional<Association> existingOpt = associationService.findByUidOptional(uid);

        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Association introuvable"));
        }

        Association existing = existingOpt.get();
        existing.setName(updatedAssociation.getName());
        existing.setDescription(updatedAssociation.getDescription());
        existing.setAdresse(updatedAssociation.getAdresse());
        existing.setContact(updatedAssociation.getContact());
        existing.setImageUrl(updatedAssociation.getImageUrl());

        existing.setProfileCompleted(
                existing.getName() != null && !existing.getName().isEmpty() &&
                        existing.getDescription() != null && !existing.getDescription().isEmpty() &&
                        existing.getAdresse() != null && !existing.getAdresse().isEmpty() &&
                        existing.getContact() != null && !existing.getContact().isEmpty()
        );

        associationService.updateAssociation(existing.getId(), existing);
        return ResponseEntity.ok(Map.of("message", "Profil mis à jour avec succès"));
    }


    @GetMapping("/me")
    public ResponseEntity<?> getOwnAssociation(Authentication auth) {
        String uid = auth.getName();
        Optional<Association> assocOpt = associationService.findByUidOptional(uid);
        return assocOpt.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Association non trouvée")));
    }


    // Supprimer son association
    @DeleteMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteOwnAssociation(@AuthenticationPrincipal OidcUser user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Accès refusé"));
        }

        Optional<Association> assocOpt = associationService.findByUidOptional(user.getSubject());
        if (assocOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Association introuvable"));
        }

        associationService.deleteAssociation(assocOpt.get().getId());
        return ResponseEntity.ok(Map.of("message", "Association supprimée"));
    }
    @GetMapping("/check/{uid}")
    public ResponseEntity<Map<String, Object>> checkAssociationExists(@PathVariable String uid) {
        // Récupérer l'utilisateur connecté depuis Spring Security
        String authenticatedUid = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!authenticatedUid.equals(uid)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Accès refusé"));
        }

        Optional<Association> assocOpt = associationService.findByUidOptional(uid);
        Map<String, Object> response = new HashMap<>();
        if (assocOpt.isPresent()) {
            response.put("exists", true);
            return ResponseEntity.ok(response);
        } else {
            response.put("exists", false);
            response.put("message", "Association non trouvée pour UID: " + uid);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssociationById(@PathVariable Long id) {
        associationService.deleteAssociation(id);
        return ResponseEntity.ok(Map.of("message", "Association supprimée"));
    }

}
