package com.example.website.dto;

import com.example.website.helpers.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ShoppingCartDTO {
    private Long userId;
    private Long productId;
    private Integer quantity;
    private Size size;
}
