package com.ocp.ecommerce.service;

import com.ocp.ecommerce.exception.OrderNotFoundException;
import com.ocp.ecommerce.model.OrderItem;
import com.ocp.ecommerce.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemService implements IOrderItemService{

    private final OrderItemRepository orderItemRepository;
    @Override
    public OrderItem getOrderItemById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("OrderItem not found with id: " + id));
    }

    @Override
    public void deleteOrderItem(Long id) {
        orderItemRepository.deleteById(id);
    }

    @Override
    public List<OrderItem> getItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }
}
