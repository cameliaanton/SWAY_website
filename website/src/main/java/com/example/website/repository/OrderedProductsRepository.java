package com.example.website.repository;

import com.example.website.entity.OrderedProducts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderedProductsRepository  extends JpaRepository<OrderedProducts,Long> {
}
