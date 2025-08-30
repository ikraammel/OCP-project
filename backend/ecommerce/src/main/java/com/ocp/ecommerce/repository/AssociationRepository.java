package com.ocp.ecommerce.repository;

import com.ocp.ecommerce.model.Association;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AssociationRepository extends JpaRepository<Association,Long> {
    boolean existsByUid(String uid);

    @Query("SELECT a FROM Association a LEFT JOIN FETCH a.category WHERE a.uid = :uid")
    Optional<Association> findByUid(String uid);
    public Optional<Association> findById(Long id);

}
