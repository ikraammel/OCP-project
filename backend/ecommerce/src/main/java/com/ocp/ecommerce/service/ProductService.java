package com.ocp.ecommerce.service;

import com.ocp.ecommerce.dto.ProductDto;
import com.ocp.ecommerce.exception.CategoryNotFoundException;
import com.ocp.ecommerce.model.Association;
import com.ocp.ecommerce.model.Category;
import com.ocp.ecommerce.model.Product;
import com.ocp.ecommerce.repository.AssociationRepository;
import com.ocp.ecommerce.repository.CategoryRepository;
import com.ocp.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AssociationRepository associationRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long productId) {
        Optional<Product> product = productRepository.findById(productId);
        return product.orElse(null);
    }

    @Override
    public Product addNewProduct(ProductDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        Association association = associationRepository.findById(dto.getAssociationId())
                .orElseThrow(() -> new CategoryNotFoundException("Association not found"));
        Product product = new Product(
                dto.getName(),
                dto.getDescription(),
                dto.getPrice(),
                dto.getNb_items(),
                dto.getImageUrl(),
                category,
                dto.getUserId(),
                association
        );


        return productRepository.save(product);
    }

    @Override
    public void deleteProductById(Long productId) {
        productRepository.deleteById(productId);
    }

    public Product updateProduct(Long productId, ProductDto productDto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        if (productDto.getName() != null) product.setName(productDto.getName());
        if (productDto.getDescription() != null) product.setDescription(productDto.getDescription());
        if (productDto.getNb_items() != 0) product.setNb_items(productDto.getNb_items());
        if (productDto.getPrice() != null) product.setPrice(productDto.getPrice());
        if (productDto.getImageUrl() != null) product.setImageUrl(productDto.getImageUrl());
        if (productDto.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Catégorie introuvable")));
        }

        return productRepository.save(product);
    }


    @Override
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public List<Product> getProductByUserId(Long userId) {
        return productRepository.findByUserId(userId);
    }

    @Override
    public List<Product> findByAssociationId(Long associationId) {
        return productRepository.findByAssociationId(associationId);
    }
}
