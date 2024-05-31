package com.example.website.controller;

import com.example.website.EmailSenderService;
import com.example.website.dto.*;
import com.example.website.entity.*;
import com.example.website.service.OrderService;
import com.example.website.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin()
@AllArgsConstructor
public class CustomerController {
    private final UserService userService;
    private final OrderService orderService;
    private final EmailSenderService emailSenderService;
    @GetMapping("/user/{userId}/cart/count")
    public ResponseEntity<Integer> getCartCount(@PathVariable Long userId) {
        int cartCount = userService.getCartCount(userId);
        return new ResponseEntity<>(cartCount, HttpStatus.OK);
    }
    @GetMapping("/sendSubscriptionEmail")
    public ResponseEntity<Void> sendSubscriptionEmail(@RequestParam String email) {
        Optional<User> customer = userService.getUser(email);
        if (customer.isPresent()) {
            sendSubscriptionEmail(customer.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    private void sendSubscriptionEmail(User customer) {
        String emailText = generateEmailTextSubscription(customer);
        emailSenderService.sendEmail(customer.getEmail(), "Sway Subscription Confirmation", emailText);
    }
    private String generateEmailTextSubscription(User customer) {
        return new StringBuilder()
                .append("Dear ").append(customer.getName()).append(",\n\n")
                .append("Thank you for subscribing to our newsletter!\n")
                .append("You will now receive updates and special offers from Sway.\n\n")
                .append("Best regards,\n")
                .append("The Sway Team")
                .toString();
    }
    @GetMapping("/user/{userId}/favorites/count")
    public ResponseEntity<Integer> getFavoriteCount(@PathVariable Long userId) {
        int favoriteCount = userService.getFavoriteCount(userId);
        return new ResponseEntity<>(favoriteCount, HttpStatus.OK);
    }
    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(@RequestParam Long id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>("User deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete user.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("order/{orderId}")
    public void deleteOrder(@PathVariable Long orderId){
        orderService.deleteOrder(orderId);
    }
    @GetMapping("orders/{userId}")
    public List<Orders> getOrders(@PathVariable Long userId){
        return userService.getAllOrders(userId);
    }
    @PostMapping("/returnToCartAndDeleteOrder/{orderId}")
    public ResponseEntity<String> returnItemsToCartAndDeleteOrder(@PathVariable Long orderId) {
        try {
            System.out.println("return order");
            orderService.returnItemsToCartAndDeleteOrder(orderId);
            return ResponseEntity.ok("Items returned to the shopping cart and order deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to return items to the shopping cart and delete the order.");
        }
    }
    @GetMapping("order/getProducts/{orderId}")
    public ResponseEntity<?> getOrderProducts(@PathVariable Long orderId) {
        Optional<List<Products>> products = userService.getOrdersProducts(orderId);
        if (products.isPresent()) {
            return new ResponseEntity<>(products, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No order in processing found.", HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/order/getProcessing/{userId}")
    public ResponseEntity<?> getOrderInProcessing(@PathVariable Long userId) {
        Optional<Orders> order = userService.getOrderInProcessing(userId);
        if (order.isPresent()) {
            return new ResponseEntity<>(order.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No order in processing found.", HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("order/confirm/{orderId}")
    public ResponseEntity<?> confirmOrder(@PathVariable Long orderId,@RequestBody ConfirmOrderDTO confirmOrderDTO){
        Optional<Orders> order =userService.confirmOrder(orderId,confirmOrderDTO.getDeliveryMethod(),confirmOrderDTO.getPaymentMethod(),confirmOrderDTO.getAddress(),confirmOrderDTO.getTotalPayment());
        if (order.isPresent()) {
            return new ResponseEntity<>(order.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No order in processing found.", HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("createOrder/{userId}")
    public ResponseEntity<?> createOrder(@PathVariable Long userId){
        try {
            userService.addOrder(userId);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/shoppingCart/updateQuantity")
    public ResponseEntity<?> updateQuantity(@RequestBody UpdateQuantityRequest request) {
        try {
            userService.updateQuantity(request.getCartItemId(), request.getQuantity());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/shoppingCart1/{id}")
    public ResponseEntity<?> getShoppingCartProducts1(@PathVariable Long id) {
        try {
            Optional<List<ShoppingCartItemDTO>> cartItems = userService.getShoppingCartsProductDTO(id);
            return new ResponseEntity<>(cartItems.orElse(new ArrayList<>()), HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/shoppingCart/{id}")
    public ResponseEntity<?> getShoppingCartProducts(@PathVariable Long id){
        try{
            // System.out.println("buna");
            Optional<List<ShoppingCart>> user =userService.getShoppingCartsProduct(id);
            return  new ResponseEntity<>(user, HttpStatus.OK);
        }catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/shoppingCart")
    public ResponseEntity<?> addToShoppingCart(@RequestBody ShoppingCartDTO shoppingCartDTO){
        try{
            // System.out.println("buna");
            Optional<User> user =userService.addToShoppingCartProduct(shoppingCartDTO.getUserId(),shoppingCartDTO.getProductId(),shoppingCartDTO.getQuantity(),shoppingCartDTO.getSize());// null;//= userService.addFavoriteProduct(favoriteRequest.getUserId(),favoriteRequest.getProductId());
            return  new ResponseEntity<>(user, HttpStatus.OK);
        }catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/favorites")
    public ResponseEntity<?> addFavoriteProducts(@RequestBody FavoriteRequest favoriteRequest){

        try{
           // System.out.println("buna");
            Optional<User> user= userService.addFavoriteProduct(favoriteRequest.getUserId(),favoriteRequest.getProductId());
            return  new ResponseEntity<>(user, HttpStatus.OK);
        }catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("favorites/{userId}")
    public ResponseEntity<?> getFavoriteProducts(@PathVariable Long userId){
        try{
            // System.out.println("buna");
            Optional<List<FavoriteProducts>> user= userService.getFavoriteProduct(userId);
            return  new ResponseEntity<>(user, HttpStatus.OK);
        }catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/favorites1/{userId}")
    public ResponseEntity<?> getFavoriteProducts1(@PathVariable Long userId) {
        try {
            Optional<List<FavoriteProductsDTO>> favoriteProducts = userService.getFavoriteProductDTO(userId);
            return new ResponseEntity<>(favoriteProducts.orElse(new ArrayList<>()), HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @DeleteMapping("/favorites")
    public ResponseEntity<?> deleteFavoriteProducts(@RequestBody FavoriteRequest favoriteRequest){

        try{
            System.out.println("buna");
            Optional<User> user= userService.deleteFavoriteProduct(favoriteRequest.getUserId(),favoriteRequest.getProductId());
            return  new ResponseEntity<>(user, HttpStatus.OK);
        }catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
