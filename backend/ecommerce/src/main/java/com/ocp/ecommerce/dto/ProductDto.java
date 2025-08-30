package com.ocp.ecommerce.dto;

import com.ocp.ecommerce.model.Product;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Long price;
    private int nb_items;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private Long userId;
    private Long associationId;
    private String associationName;

    public ProductDto(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.nb_items = product.getNb_items();
        this.imageUrl = product.getImageUrl();
        this.categoryId = product.getCategory() != null ? product.getCategory().getId() : null;
        this.userId = product.getUserId();
        this.associationId = product.getAssociation() != null ? product.getAssociation().getId() : null;
        this.associationName = product.getAssociation() != null ? product.getAssociation().getName() : null;
        this.categoryName = product.getCategory() != null ? product.getCategory().getName() : null;
    }

}
