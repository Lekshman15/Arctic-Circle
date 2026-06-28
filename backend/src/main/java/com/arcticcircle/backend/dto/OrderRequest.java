package com.arcticcircle.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class OrderRequest {
    private UUID productId;
}