package com.ocp.ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userUid;

    @OneToMany(mappedBy = "cart",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<CartItem> items;
}
