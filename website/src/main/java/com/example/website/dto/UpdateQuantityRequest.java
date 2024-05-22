package com.example.website.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateQuantityRequest {
    private Long cartItemId;
    private Integer quantity;
}
