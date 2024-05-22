package com.example.website.repository;

import com.example.website.entity.Password;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordRepository extends JpaRepository<Password,Long> {
    Optional<Password> findByUserId(Long userId);
}
