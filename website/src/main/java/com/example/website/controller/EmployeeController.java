package com.example.website.controller;

import com.example.website.dto.OrderDTO;
import com.example.website.entity.Orders;
import com.example.website.entity.Products;
import com.example.website.entity.User;
import com.example.website.helpers.OrderStatus;
import com.example.website.service.OrderService;
import com.example.website.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@AllArgsConstructor
@RequestMapping("/employee")
public class EmployeeController {
    private final OrderService orderService;
    private final UserService userService;
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getOrders() {
        List<OrderDTO> orders=orderService.getAllOrdersDTO();
        return new ResponseEntity<>(orders, HttpStatus.CREATED);
    }
    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long id) {
        OrderDTO orders=orderService.getOrderDTO(id);
        return new ResponseEntity<>(orders, HttpStatus.CREATED);
    }
    @PutMapping("order/{id}/status/{orderStatus}")
    public ResponseEntity<OrderDTO> updateStatus(@PathVariable Long id, @PathVariable String orderStatus){
        System.out.println("afara e frumos"+orderStatus);
        OrderDTO order= orderService.updateOrderStatus(id,orderStatus);
        return new ResponseEntity<>(order,HttpStatus.OK);
    }
    @GetMapping("/order/getProducts/{orderId}")
    public ResponseEntity<?> getOrderProducts(@PathVariable Long orderId) {
        Optional<List<Products>> products = orderService.getOrdersProducts(orderId);
        if (products.isPresent()) {
            return new ResponseEntity<>(products, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No order in processing found.", HttpStatus.NOT_FOUND);
        }
    }
}
