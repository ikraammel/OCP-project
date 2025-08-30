package com.ocp.ecommerce.controller;

import com.ocp.ecommerce.dto.ProductDto;
import com.ocp.ecommerce.model.Product;
import com.ocp.ecommerce.service.IProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private IProductService productService;

    @GetMapping
    public List<ProductDto> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return products.stream()
                .map(product -> new ProductDto(product))
                .collect(Collectors.toList());
    }



    @GetMapping("/{productId}")
    public Product getProductById(@PathVariable Long productId){
        return productService.getProductById(productId);
    }

    @PostMapping("/newProduct")
    public Product addProduct(@RequestBody ProductDto product){
        return productService.addNewProduct(product);
    }

    @PutMapping("/{productId}")
    public Product updateProduct(@PathVariable Long productId,
                                 @RequestBody ProductDto productDto) {
        return productService.updateProduct(productId, productDto);
    }

    @DeleteMapping("/delete/{productId}")
    public void deleteProductById(@PathVariable Long productId){
         productService.deleteProductById(productId);
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId){
        return productService.getProductsByCategoryId(categoryId);
    }

    @GetMapping("/by-association/{associationId}")
    public ResponseEntity<List<Product>> getProductsByAssociation(@PathVariable Long associationId) {
        return ResponseEntity.ok(productService.findByAssociationId(associationId));
    }
}
