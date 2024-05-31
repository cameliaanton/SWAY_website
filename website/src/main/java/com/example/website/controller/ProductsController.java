package com.example.website.controller;

import com.example.website.entity.Inventory;
import com.example.website.entity.Products;
import com.example.website.helpers.Color;
import com.example.website.helpers.ProductGender;
import com.example.website.helpers.Size;
import com.example.website.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin()
@AllArgsConstructor
public class ProductsController {
    private final ProductService productService;

    @GetMapping("/products/{gender}")
    public List<Products> getProductsByGender(@PathVariable ProductGender gender) {
        return productService.getProductsByGender(gender);
    }

    @PostMapping("/addProduct")
    public Products createProduct(@RequestBody Products product) {
        return productService.addProduct(product);
    }

    @GetMapping("/allProducts")
    public List<Products> getAllProducts() {
        System.out.println("Fetching all products");
        List<Products> products = productService.getProducts();
        System.out.println("Products fetched: " + products.size());
        return products;
    }

    @GetMapping("/product/color/{id}")
    public HashMap<Color, Products> getColorProducts(@PathVariable Long id) {
        Products products = productService.getProductById(id);
        return productService.colorProducts(products);
    }

    @PostMapping("/product/asc")
    public List<Products> getProductsAscending(@RequestBody List<Products> productsList) {
        return productService.sortByAscendingPrice(productsList);
    }

    @PostMapping("/product/desc")
    public List<Products> getProductsDescending(@RequestBody List<Products> productsList) {
        return productService.sortByDownwardPrice(productsList);
    }

    @PostMapping("/product/random")
    public List<Products> getProductsRandom(@RequestBody List<Products> productsList) {
        return productService.sortByShuffleProducts(productsList);
    }

    @GetMapping("/product/{id}")
    public Products getProductID(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/product/{id}/inventory")
    public List<Inventory> getInventoryByProduct(@PathVariable Long id) {
        Products product = getProductID(id);
        List<Inventory> inventory = productService.getInventoryByProduct(product);
        return inventory;
    }

    @GetMapping("/product/{id}/size/{size}")
    public List<Inventory> getInventoryByProductBySize(@PathVariable Long id, @PathVariable Size size) {
        Products product = getProductID(id);
        return productService.getInventoryByProductAndSize(product, size);
    }

    @PutMapping("/product/{id}")
    public Products updateProduct(@PathVariable Long id, @RequestBody Products product) {
        return productService.updateProduct(id, product);
    }
}
