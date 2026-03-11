package com.shopflow.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Product name is required")
        private String name;

        private String description;

        @NotNull(message = "Price is required")
        @Min(value = 0, message = "Price must be non-negative")
        private BigDecimal price;

        @Min(value = 0, message = "Stock must be non-negative")
        private Integer stockQuantity = 0;

        private String category;

        private String imageUrl;
    }

    @Data
    public static class UpdateRequest {
        private String name;
        private String description;
        private BigDecimal price;
        private Integer stockQuantity;
        private String category;
        private String imageUrl;
        private Boolean active;
    }

    @Data
    public static class ProductResponse {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer stockQuantity;
        private String category;
        private String imageUrl;
        private boolean active;
        private LocalDateTime createdAt;
    }
}
