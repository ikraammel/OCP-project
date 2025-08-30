package com.ocp.ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "customer_order")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private LocalDateTime orderDate;
    private boolean paid;

    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL)
    private List<OrderItem> items;

}
