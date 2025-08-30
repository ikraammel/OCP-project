package com.ocp.ecommerce.service;

import com.ocp.ecommerce.dto.CategoryDto;
import com.ocp.ecommerce.model.Category;

import java.util.List;

public interface ICategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long categoryId);
    Category addCategory(CategoryDto categoryDto);
    Category updateCategory(Long categoryId,CategoryDto categoryDto);
    void deleteCategory(Long categoryId);
}
