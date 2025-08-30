package com.ocp.ecommerce.dto;

import lombok.Data;

@Data
public class OrderItemDto {
    private Long productId;
    private int quantity;
    private Long price;
}
