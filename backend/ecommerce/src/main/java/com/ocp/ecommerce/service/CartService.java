package com.ocp.ecommerce.service;

import com.ocp.ecommerce.dto.CartRequest;
import com.ocp.ecommerce.model.CartItem;
import com.ocp.ecommerce.model.Product;
import com.ocp.ecommerce.repository.CartItemRepository;
import com.ocp.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService implements ICartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    // 🔹 Récupérer tout le panier d’un utilisateur
    @Override
    public List<CartItem> getCartItems(String userId) {
        return cartItemRepository.findByUserId(userId);
    }

    // 🔹 Ajouter un produit au panier (version classique)
    @Override
    public CartItem addToCart(Long productId, String userId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        CartItem existingItem = cartItemRepository.findByUserId(userId).stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepository.save(existingItem);
        }

        CartItem newItem = new CartItem();
        newItem.setProduct(product);
        newItem.setUserId(userId);
        newItem.setQuantity(quantity);

        return cartItemRepository.save(newItem);
    }

    // 🔹 Ajouter un produit au panier (version CartRequest pour OAuth)
    public CartItem addToCart(String userId, CartRequest request) {
        return addToCart(request.getProductId(), userId, request.getQuantity());
    }

    // 🔹 Mettre à jour la quantité (version classique)
    @Override
    public CartItem updateQuantity(Long cartItemId, String userId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Item du panier non trouvé"));

        if (!item.getUserId().equals(userId)) {
            throw new RuntimeException("Vous ne pouvez pas modifier cet item");
        }

        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    // 🔹 Mettre à jour la quantité (version CartRequest pour OAuth)
    public CartItem updateCartItem(String userId, CartRequest request) {
        CartItem item = cartItemRepository.findByUserId(userId).stream()
                .filter(i -> i.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item non trouvé dans le panier"));

        item.setQuantity(request.getQuantity());
        return cartItemRepository.save(item);
    }

    // 🔹 Supprimer un item (version classique)
    @Override
    public void removeFromCart(Long cartItemId, String userId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Item du panier non trouvé"));

        if (!item.getUserId().equals(userId)) {
            throw new RuntimeException("Vous ne pouvez pas supprimer cet item");
        }

        cartItemRepository.delete(item);
    }

    // 🔹 Supprimer un item (version CartRequest pour OAuth)
    public void removeFromCart(String userId, CartRequest request) {
        CartItem item = cartItemRepository.findByUserId(userId).stream()
                .filter(i -> i.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item non trouvé dans le panier"));

        cartItemRepository.delete(item);
    }
}
