package com.ocp.ecommerce.dto;

import lombok.Data;

@Data
public class CategoryDto {
    private String name;
    private String description;

    private CategoryDto(String name,String description){
        this.name = name;
        this.description = description;
    }
}
