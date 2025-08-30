package com.ocp.ecommerce.service;

import com.ocp.ecommerce.dto.OrderDto;
import com.ocp.ecommerce.exception.OrderNotFoundException;
import com.ocp.ecommerce.exception.ProductNotFoundException;
import com.ocp.ecommerce.model.Order;
import com.ocp.ecommerce.model.OrderItem;
import com.ocp.ecommerce.model.Product;
import com.ocp.ecommerce.repository.OrderRepository;
import com.ocp.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService{
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    @Override
    public Order createOrder(OrderDto orderDto) {
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setPaid(false);
        order.setUserId(orderDto.getUserId());

        List<OrderItem> orderItems = orderDto.getItems().stream().map(itemDto -> {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException("Product "+itemDto.getProductId()+" not found"));
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice() * itemDto.getQuantity());
            orderItem.setOrder(order);
            return orderItem;
        }).toList();
        order.setItems(orderItems);
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Oder not found with id : "+ orderId));
    }

    @Override
    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }
}
