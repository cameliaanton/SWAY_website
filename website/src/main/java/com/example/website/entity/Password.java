package com.example.website.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "t_password")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Password {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "password")
    private String password;

    @Column(name = "salt")
    private byte[] salt;
}