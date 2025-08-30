package com.ocp.ecommerce.service;

import com.ocp.ecommerce.model.Association;

import java.util.List;
import java.util.Optional;

public interface IAssociationService {
    Association createAssociation(Association association, String uid);
    Association getAssociationById(Long id);
    List<Association> getAllAssociations();
    Association updateAssociation(Long id, Association association);
    void deleteAssociation(Long id);
    boolean existsByUID(String uid);
    Association findByUid(String uid);
    Association findById(Long id);
    Optional<Association> findByUidOptional(String uid);
    Optional<Association> findByIdOptional(Long id); // <-- ajouter ceci
}

