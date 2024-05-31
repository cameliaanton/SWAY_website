package com.example.website.repository;

import com.example.website.entity.FavoriteProducts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteProductsRepository extends JpaRepository<FavoriteProducts, Long> {
    List<FavoriteProducts> findByCustomerId(Long userId);

    int countByCustomer_Id(Long customerId);
}
