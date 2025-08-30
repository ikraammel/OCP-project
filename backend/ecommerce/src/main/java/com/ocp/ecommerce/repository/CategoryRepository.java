package com.ocp.ecommerce.repository;

import com.ocp.ecommerce.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {
}
