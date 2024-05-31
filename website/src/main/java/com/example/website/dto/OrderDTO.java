package com.example.website.dto;

import com.example.website.entity.OrderedProducts;
import com.example.website.helpers.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private Double paymentSum;
    private OrderStatus status;
    private LocalDateTime dateTime;
    private String deliveryMethod;
    private String payMethod;
    private String deliveryAddress;
    private List<OrderedProducts> orderedProducts;
}