package com.ocp.ecommerce.repository;

import com.ocp.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order,Long> {
}
