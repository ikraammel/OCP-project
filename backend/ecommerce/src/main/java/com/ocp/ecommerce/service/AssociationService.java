package com.ocp.ecommerce.service;

import com.ocp.ecommerce.model.Association;
import com.ocp.ecommerce.repository.AssociationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssociationService implements IAssociationService {

    @Autowired
    private AssociationRepository associationRepository;

    @Override
    public Association createAssociation(Association association, String uid) {
        association.setUid(uid);
        return associationRepository.save(association);
    }

    @Override
    public Optional<Association> findByUidOptional(String uid) {
        return associationRepository.findByUid(uid);
    }

    @Override
    public Optional<Association> findByIdOptional(Long id) {
        return associationRepository.findById(id);
    }

    @Override
    public List<Association> getAllAssociations() {
        return associationRepository.findAll();
    }

    @Override
    public Association updateAssociation(Long id, Association association) {
        Optional<Association> existingOpt = findByIdOptional(id);
        if (existingOpt.isEmpty()) return null;

        Association existingAssoc = existingOpt.get();
        existingAssoc.setName(association.getName());
        existingAssoc.setDescription(association.getDescription());
        existingAssoc.setEmail(association.getEmail());
        existingAssoc.setContact(association.getContact());
        existingAssoc.setAdresse(association.getAdresse());
        existingAssoc.setCategory(association.getCategory());
        existingAssoc.setUser(association.getUser());
        existingAssoc.setImageUrl(association.getImageUrl());
        return associationRepository.save(existingAssoc);
    }

    @Override
    public void deleteAssociation(Long id) {
        if (associationRepository.existsById(id)) {
            associationRepository.deleteById(id);
        }
    }

    @Override
    public boolean existsByUID(String uid) {
        return associationRepository.existsByUid(uid);
    }
    @Override
    public Association getAssociationById(Long id) {
        return findByIdOptional(id).orElse(null);
    }

    @Override
    public Association findByUid(String uid) {
        return findByUidOptional(uid).orElse(null);
    }

    @Override
    public Association findById(Long id) {
        return findByIdOptional(id).orElse(null);
    }

}
