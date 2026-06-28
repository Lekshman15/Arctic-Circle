package com.arcticcircle.backend.dto;

import com.arcticcircle.backend.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private UUID productId;
    private String brand;
    private String modelName;
    private BigDecimal tonnage;
    private Integer starRating;
    private Product.ProductType type;
    private BigDecimal price;
    private String imageUrl;
}