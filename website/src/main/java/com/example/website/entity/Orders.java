package com.example.website.entity;

import com.example.website.helpers.OrderStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.scheduling.support.SimpleTriggerContext;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "t_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonBackReference
    private Customer customer;

    @Column(name= "payment_sum", nullable = false)
    private Double paymentSum;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)  // Ensure sufficient length
    private OrderStatus status;

    @Column(name="date_time", nullable = false)
    private LocalDateTime dateTime;
    @Column(name = "devilvery_method")
    private String delivery_method;
    @Column(name="pay_method")
    private String payMethod;
    @Column(name="delivery_address")
    private String deliveryAddress;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "order")
    @JsonManagedReference
    private List<OrderedProducts> orderedProducts = new ArrayList<>();
}
