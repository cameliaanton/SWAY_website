package com.example.website.controller;

import com.example.website.dto.ProductsDTO;
import com.example.website.entity.Products;
import com.example.website.entity.User;
import com.example.website.service.ProductService;
//import com.example.website.service.ReportService;
import com.example.website.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@AllArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final ProductService productService;
    private final UserService userService;
   // private final ReportService reportService;

    // Product management endpoints
    @PostMapping("/addProduct")
    public ResponseEntity<Products> addProduct(@RequestBody Products products) {
        Products addedProduct = productService.addProduct(products);
        return new ResponseEntity<>(addedProduct, HttpStatus.CREATED);
    }

    @GetMapping("/products")
    public ResponseEntity<List<Products>> allProducts() {
        List<Products> products = productService.getProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // User management endpoints
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    /*/ Report management endpoint
    @GetMapping("/reports")
    public ResponseEntity<?> getReports() {
        try {
            var report = reportService.getReports();
            return new ResponseEntity<>(report, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to fetch reports.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } */
}
