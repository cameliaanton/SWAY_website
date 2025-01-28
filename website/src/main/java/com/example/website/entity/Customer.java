package com.example.website.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("1")
public class Customer extends User {

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "customer")
    @JsonManagedReference
    @ToString.Exclude
    private List<Orders> ordersList = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "customer",orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    private List<ShoppingCart> shoppingCart = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "customer",orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    private List<FavoriteProducts> favoriteProducts = new ArrayList<>();

    @Column(name="address")
    private String address;
    @Column(name="telephone")
    private String telephone;
    @Column(name="gender")
    private String gender;
    @Column(name="subcribe")
    private Boolean subscribe;
    @Column(name="dataNastere")
    private Date dateBirth;
}
