package com.ocp.ecommerce.service;

import com.ocp.ecommerce.dto.OrderDto;
import com.ocp.ecommerce.model.Order;

import java.util.List;

public interface IOrderService {
    Order createOrder(OrderDto orderDto);
    List<Order> getAllOrders();
    Order getOrderById(Long orderId);
    void deleteOrder(Long orderId);
}
