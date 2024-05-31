package com.example.website.entity;

import com.example.website.helpers.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "t_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "inventories")
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name",nullable = false)
    private String name;

    @Column(name = "description",nullable = false)
    private String description;

    @Column(name = "price",nullable = false)
    private Double price;
    @Enumerated(EnumType.STRING)
    @Column(name = "gender",nullable = false)
    private ProductGender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "category",nullable = false)
    private ProductCategory category;
    @ElementCollection
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "subcategories", joinColumns = @JoinColumn(name = "id"))
    @Column(name = "subcategory")
    private Set<SubCategory> subCategories;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    @Enumerated(EnumType.STRING)
    @Column(name = "color", nullable = false)
    private Color color;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Inventory> inventories;



}
