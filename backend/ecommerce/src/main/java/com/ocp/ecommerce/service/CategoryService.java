package com.ocp.ecommerce.service;

import com.ocp.ecommerce.dto.CategoryDto;
import com.ocp.ecommerce.exception.CategoryNotFoundException;
import com.ocp.ecommerce.model.Category;
import com.ocp.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService{

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.getById(categoryId);
    }

    @Override
    public Category addCategory(CategoryDto categoryDto) {
        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long categoryId, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found "));
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
