package com.ocp.ecommerce.controller;

import com.ocp.ecommerce.dto.OrderDto;
import com.ocp.ecommerce.model.Order;
import com.ocp.ecommerce.service.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final IOrderService orderService;

    // Créer une commande
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderDto orderDto) {
        Order order = orderService.createOrder(orderDto);
        return ResponseEntity.status(201).body(order);
    }

    // Récupérer toutes les commandes
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Récupérer une commande par ID
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    // Supprimer une commande
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
