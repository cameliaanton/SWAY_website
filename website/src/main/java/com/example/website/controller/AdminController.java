package com.example.website.controller;

import com.example.website.dto.ProductsDTO;
import com.example.website.dto.RegisterClient;
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
import java.util.Optional;

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
    @PutMapping("product/{id}")
    public ResponseEntity<Products> updateProduct(@PathVariable Long id,@RequestBody Products updateProduct) {
        productService.updateProduct(id,updateProduct);
        return new ResponseEntity<>(updateProduct,HttpStatus.OK);
    }
    @DeleteMapping("product/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/product/{id}")
    public ResponseEntity<Products> getProduct(@PathVariable Long id) {
        Products products = productService.getProductById(id);
        return new ResponseEntity<>(products, HttpStatus.OK);
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
    @GetMapping("user/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        Optional<User> user = userService.getUser(id);
        return new ResponseEntity<>(user.get(), HttpStatus.OK);
    }
    @PostMapping("/addUser")
    public ResponseEntity<Long> addUser(@RequestBody RegisterClient user) {
        Long addedUser;
        if(user.getUser().getRole()==0)
            addedUser = userService.registerAdmin(user);
        else
            addedUser = userService.registerEmployee(user);
        return new ResponseEntity<>(addedUser, HttpStatus.CREATED);
    }
    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        return new ResponseEntity<>(user, HttpStatus.OK);
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
