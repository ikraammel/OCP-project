package com.ocp.ecommerce.service;

import com.ocp.ecommerce.model.OrderItem;

import java.util.List;

public interface IOrderItemService {
    OrderItem getOrderItemById(Long id);
    void deleteOrderItem(Long id);
    List<OrderItem> getItemsByOrderId(Long orderId);
}
