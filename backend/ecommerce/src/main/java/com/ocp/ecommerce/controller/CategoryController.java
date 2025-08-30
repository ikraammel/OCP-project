package com.ocp.ecommerce.controller;

import com.ocp.ecommerce.dto.CategoryDto;
import com.ocp.ecommerce.model.Category;
import com.ocp.ecommerce.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private ICategoryService categoryService;

    @GetMapping
    public List<Category> getAllCategories(){
        return categoryService.getAllCategories();
    }

    @GetMapping("/{categoryId}")
    public Category getCategoryById(@PathVariable Long categoryId){
        return categoryService.getCategoryById(categoryId);
    }

    @PostMapping("/new")
    public Category addCategory(@RequestBody CategoryDto categoryDto){
        return categoryService.addCategory(categoryDto);
    }

    @PutMapping("/update/{categoryId}")
    public Category updateCategory(@PathVariable Long categoryId,@RequestBody CategoryDto categoryDto){
        return categoryService.updateCategory(categoryId,categoryDto);
    }

    @DeleteMapping("/{categoryId}")
    public void deleteCategory(@PathVariable Long categoryId){
        categoryService.deleteCategory(categoryId);
    }
}
