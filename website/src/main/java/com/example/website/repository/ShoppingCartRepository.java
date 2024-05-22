package com.example.website.repository;

import com.example.website.entity.ShoppingCart;
import com.example.website.helpers.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShoppingCartRepository extends JpaRepository<ShoppingCart,Long> {
    Optional<ShoppingCart> findByCustomerIdAndProductIdAndSize(Long id, Long productId, Size size);

    List<ShoppingCart> findByCustomerId(Long userId);
}
