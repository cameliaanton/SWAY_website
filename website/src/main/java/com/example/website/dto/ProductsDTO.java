package com.example.website.dto;

import lombok.Data;
import java.util.List;
import java.util.Set;

@Data
public class ProductsDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String gender;
    private String category;
    private Set<String> subCategories;
    private List<String> imageUrls;
    private String color;
    private List<InventoryDTO> inventories;
}
