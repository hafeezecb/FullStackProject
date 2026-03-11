package com.shopflow.product.repository;

import com.shopflow.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryIgnoreCaseAndActiveTrue(String category);
    List<Product> findByActiveTrue();
    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);
}
