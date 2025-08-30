package com.ocp.ecommerce.service;

import com.ocp.ecommerce.dto.ProductDto;
import com.ocp.ecommerce.model.Product;

import java.util.List;

public interface IProductService {
    List<Product> getAllProducts();
    Product getProductById(Long productId);
    Product addNewProduct(ProductDto dto);
    void deleteProductById(Long productId);
    Product updateProduct(Long productId,ProductDto dto);
    List<Product> getProductsByCategoryId(Long categoryId);
    List<Product> getProductByUserId(Long userId);

    List<Product> findByAssociationId(Long associationId);
}
