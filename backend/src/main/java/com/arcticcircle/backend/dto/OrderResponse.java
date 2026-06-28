package com.arcticcircle.backend.dto;

import com.arcticcircle.backend.model.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private UUID orderId;
    private String customerName;
    private String customerPhone;
    private String productName;
    private String productBrand;
    private Order.OrderStatus status;
    private LocalDateTime createdAt;
}