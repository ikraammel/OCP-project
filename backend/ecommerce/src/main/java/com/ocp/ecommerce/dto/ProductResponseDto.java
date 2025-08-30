package com.ocp.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDto {
    private Long id;
    private String name;
    private String description;
    private Long price;
    private int nb_items;
    private String imageUrl;
    private String categoryName;
    private String associationName;
}
