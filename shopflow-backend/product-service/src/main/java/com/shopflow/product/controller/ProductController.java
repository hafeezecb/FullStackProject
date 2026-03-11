package com.shopflow.product.controller;

import com.shopflow.product.dto.ProductDto;
import com.shopflow.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDto.ProductResponse> createProduct(
            @Valid @RequestBody ProductDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request));
    }

    @GetMapping
    public ResponseEntity<List<ProductDto.ProductResponse>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(productService.getAllProducts(category, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto.ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto.ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDto.UpdateRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Internal endpoint for Order Service to decrease stock
    @PutMapping("/{id}/decrease-stock")
    public ResponseEntity<Boolean> decreaseStock(
            @PathVariable Long id,
            @RequestParam int quantity) {
        return ResponseEntity.ok(productService.decreaseStock(id, quantity));
    }
}
