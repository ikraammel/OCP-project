package com.ocp.ecommerce.repository;

import com.ocp.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUid(String uid);

    boolean existsByEmail(String email);
}
