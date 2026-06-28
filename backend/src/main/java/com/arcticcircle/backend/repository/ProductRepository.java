package com.arcticcircle.backend.repository;

import com.arcticcircle.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByBrand(String brand);
    List<Product> findByType(Product.ProductType type);
    List<Product> findByStarRatingGreaterThanEqual(Integer starRating);
}