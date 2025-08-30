package com.ocp.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String description;

    @Column(length = 2000)
    private String imageUrl;

    @Column(length = 200)
    private String name;
    private Long price;
    private int nb_items;
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties("products")
    private Category category;

    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<OrderItem> items;

    @ManyToOne
    @JoinColumn(name = "association_id")
    @JsonBackReference
    private Association association;

    @OneToMany
    private List<CartItem> cartItems;

    public Product(String name, String description, Long price, int nb_items, String imageUrl,
                   Category category,Long userId,Association association) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.nb_items = nb_items;
        this.imageUrl = imageUrl;
        this.category = category;
        this.userId = userId;
        this.association = association;
    }

}
