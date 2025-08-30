package com.ocp.ecommerce.service;

import com.ocp.ecommerce.dto.CartRequest;
import com.ocp.ecommerce.model.CartItem;
import java.util.List;

public interface ICartService {
    List<CartItem> getCartItems(String userId);

    CartItem addToCart(Long productId, String userId, int quantity);

    void removeFromCart(Long cartItemId, String userId);

    CartItem updateQuantity(Long cartItemId, String userId, int quantity);

    // 🔹 Nouvelles méthodes pour CartRequest
    CartItem addToCart(String userId, CartRequest request);

    CartItem updateCartItem(String userId, CartRequest request);

    void removeFromCart(String userId, CartRequest request);

}

