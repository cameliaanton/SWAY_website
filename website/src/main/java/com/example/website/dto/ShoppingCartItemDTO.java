package com.example.website.dto;

import com.example.website.entity.Products;
import com.example.website.helpers.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ShoppingCartItemDTO {
    private Long id;
    private Products product;
    private Size size;
    private Integer quantity;
    private Double price;
}
