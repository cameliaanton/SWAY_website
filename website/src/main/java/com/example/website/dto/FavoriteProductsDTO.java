package com.example.website.dto;

import com.example.website.entity.Products;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteProductsDTO {
    private Long id;
    private Long productId;
    private Products product;
}

