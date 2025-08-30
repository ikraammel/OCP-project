package com.ocp.ecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "association", uniqueConstraints = @UniqueConstraint(columnNames = "uid"))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Association {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String uid;
    @Column(name = "image_url",length = 512)
    private String imageUrl;
    private String name;

    @Column(length = 1000)
    private String description;
    private String email;
    private String adresse;
    private String contact;

    @Column(name = "profile_completed", columnDefinition = "boolean default false")
    private Boolean profileCompleted = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @NotNull
    private Category category;

    @OneToOne
    private User user;
}
