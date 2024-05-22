package com.example.website.repository;

import com.example.website.entity.Inventory;
import com.example.website.entity.Products;
import com.example.website.helpers.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory,Long> {
    List<Inventory> findByProduct(Products product);
    List<Inventory> findByProductAndSize(Products product, Size size);
}
