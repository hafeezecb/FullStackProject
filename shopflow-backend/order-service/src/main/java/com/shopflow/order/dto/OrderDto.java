package com.shopflow.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        private String productName;

        @Min(1)
        private Integer quantity;

        @NotNull
        private BigDecimal unitPrice;
    }

    @Data
    public static class CreateOrderRequest {
        @NotNull
        private Long userId;

        @NotEmpty
        private List<OrderItemRequest> items;

        private String shippingAddress;
    }

    @Data
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }

    @Data
    public static class OrderResponse {
        private Long id;
        private Long userId;
        private String status;
        private BigDecimal totalAmount;
        private String shippingAddress;
        private List<OrderItemResponse> items;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    public static class UpdateStatusRequest {
        @NotNull
        private String status;
    }
}
