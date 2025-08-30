package com.ocp.ecommerce.controller;

import com.ocp.ecommerce.model.OrderItem;
import com.ocp.ecommerce.service.IOrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@RequiredArgsConstructor
public class OrderItemController {

    private final IOrderItemService orderItemService;

    // Récupérer un OrderItem par ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getOrderItemById(@PathVariable Long id) {
        return ResponseEntity.ok(orderItemService.getOrderItemById(id));
    }

    // Supprimer un OrderItem
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.noContent().build();
    }

    // Récupérer tous les OrderItems d'une commande
    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<List<OrderItem>> getItemsByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderItemService.getItemsByOrderId(orderId));
    }
}

