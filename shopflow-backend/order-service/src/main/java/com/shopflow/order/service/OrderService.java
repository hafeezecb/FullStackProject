package com.shopflow.order.service;

import com.shopflow.order.dto.OrderDto;
import com.shopflow.order.model.Order;
import com.shopflow.order.model.OrderItem;
import com.shopflow.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional
    public OrderDto.OrderResponse createOrder(OrderDto.CreateOrderRequest request) {
        Order order = Order.builder()
                .userId(request.getUserId())
                .shippingAddress(request.getShippingAddress())
                .totalAmount(BigDecimal.ZERO)
                .build();

        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            BigDecimal subtotal = itemReq.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            return OrderItem.builder()
                    .order(order)
                    .productId(itemReq.getProductId())
                    .productName(itemReq.getProductName())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        order.setItems(items);
        BigDecimal total = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        return toResponse(orderRepository.save(order));
    }

    public OrderDto.OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        return toResponse(order);
    }

    public List<OrderDto.OrderResponse> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<OrderDto.OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderDto.OrderResponse updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderDto.OrderResponse cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new RuntimeException("Only PENDING orders can be cancelled");
        }
        order.setStatus(Order.OrderStatus.CANCELLED);
        return toResponse(orderRepository.save(order));
    }

    private OrderDto.OrderResponse toResponse(Order order) {
        OrderDto.OrderResponse r = new OrderDto.OrderResponse();
        r.setId(order.getId());
        r.setUserId(order.getUserId());
        r.setStatus(order.getStatus().name());
        r.setTotalAmount(order.getTotalAmount());
        r.setShippingAddress(order.getShippingAddress());
        r.setCreatedAt(order.getCreatedAt());
        r.setUpdatedAt(order.getUpdatedAt());
        r.setItems(order.getItems().stream().map(item -> {
            OrderDto.OrderItemResponse ir = new OrderDto.OrderItemResponse();
            ir.setId(item.getId());
            ir.setProductId(item.getProductId());
            ir.setProductName(item.getProductName());
            ir.setQuantity(item.getQuantity());
            ir.setUnitPrice(item.getUnitPrice());
            ir.setSubtotal(item.getSubtotal());
            return ir;
        }).collect(Collectors.toList()));
        return r;
    }
}
