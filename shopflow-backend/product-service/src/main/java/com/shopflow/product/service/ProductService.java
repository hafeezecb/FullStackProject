package com.shopflow.product.service;

import com.shopflow.product.dto.ProductDto;
import com.shopflow.product.model.Product;
import com.shopflow.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional
    public ProductDto.ProductResponse createProduct(ProductDto.CreateRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .build();
        return toResponse(productRepository.save(product));
    }

    public List<ProductDto.ProductResponse> getAllProducts(String category, String search) {
        List<Product> products;
        if (search != null && !search.isBlank()) {
            products = productRepository.findByNameContainingIgnoreCaseAndActiveTrue(search);
        } else if (category != null && !category.isBlank()) {
            products = productRepository.findByCategoryIgnoreCaseAndActiveTrue(category);
        } else {
            products = productRepository.findByActiveTrue();
        }
        return products.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductDto.ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return toResponse(product);
    }

    @Transactional
    public ProductDto.ProductResponse updateProduct(Long id, ProductDto.UpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStockQuantity() != null) product.setStockQuantity(request.getStockQuantity());
        if (request.getCategory() != null) product.setCategory(request.getCategory());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getActive() != null) product.setActive(request.getActive());

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setActive(false);
        productRepository.save(product);
    }

    @Transactional
    public boolean decreaseStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        if (product.getStockQuantity() < quantity) return false;
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);
        return true;
    }

    private ProductDto.ProductResponse toResponse(Product product) {
        ProductDto.ProductResponse r = new ProductDto.ProductResponse();
        r.setId(product.getId());
        r.setName(product.getName());
        r.setDescription(product.getDescription());
        r.setPrice(product.getPrice());
        r.setStockQuantity(product.getStockQuantity());
        r.setCategory(product.getCategory());
        r.setImageUrl(product.getImageUrl());
        r.setActive(product.isActive());
        r.setCreatedAt(product.getCreatedAt());
        return r;
    }
}
