package com.example.website.service;

import com.example.website.dto.OrderDTO;
import com.example.website.entity.*;
import com.example.website.helpers.OrderStatus;
import com.example.website.repository.OrdersRepository;
import com.example.website.repository.ProductRepository;
import com.example.website.repository.ShoppingCartRepository;
import com.example.website.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Autowired
    private ProductRepository productRepository;

    private UserRepository userRepository;
    public List<Orders> getAllOrders(){
        return ordersRepository.findAll();
    }
    public OrderDTO updateOrderStatus(Long id, String status){
        Orders order = ordersRepository.findById(id).get();
        OrderStatus orderStatus= OrderStatus.valueOf(status);
        order.setStatus(orderStatus);
        System.out.println(order);
        ordersRepository.save(order);
        System.out.println(order);
        return new OrderDTO(
                order.getId(),
                order.getCustomer().getId(),
                order.getCustomer().getName(),
                order.getPaymentSum(),
                order.getStatus(),
                order.getDateTime(),
                order.getDelivery_method(),
                order.getPayMethod(),
                order.getDeliveryAddress(),
                order.getOrderedProducts()
        );
    }
    public OrderDTO getOrderDTO(Long id){
        Orders order = ordersRepository.findById(id).get();
        return new OrderDTO(
                order.getId(),
                order.getCustomer().getId(),
                order.getCustomer().getName(),
                order.getPaymentSum(),
                order.getStatus(),
                order.getDateTime(),
                order.getDelivery_method(),
                order.getPayMethod(),
                order.getDeliveryAddress(),
                order.getOrderedProducts()
        );
    }
    public List<OrderDTO> getAllOrdersDTO(){
        List<Orders> orders = ordersRepository.findAll();
        return orders.stream().map(order -> new OrderDTO(
                order.getId(),
                order.getCustomer().getId(),
                order.getCustomer().getName(),
                order.getPaymentSum(),
                order.getStatus(),
                order.getDateTime(),
                order.getDelivery_method(),
                order.getPayMethod(),
                order.getDeliveryAddress(),
                order.getOrderedProducts()
        )).collect(Collectors.toList());
    }
    public  void deleteOrder(Long orderId){
        ordersRepository.delete(ordersRepository.getReferenceById(orderId));
    }
    public Optional<List<Products>> getOrdersProducts(Long orderId) {
        Optional<Orders> orders= ordersRepository.findById(orderId);
        List<OrderedProducts> orderedProducts=orders.get().getOrderedProducts();
        List<Products> products=orderedProducts.stream()
                .map(p-> productRepository.findById(p.getProductId()).get())
                .toList();
        return Optional.of(products);
    }
    public void returnItemsToCartAndDeleteOrder(Long orderId) {
        Optional<Orders> optionalOrder = ordersRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Orders order = optionalOrder.get();
            List<OrderedProducts> orderedProducts = order.getOrderedProducts();
            for (OrderedProducts orderedProduct : orderedProducts) {
                ShoppingCart shoppingCart = new ShoppingCart();
                shoppingCart.setProductId(orderedProduct.getProductId());
                shoppingCart.setQuantity(orderedProduct.getQuantity());
                shoppingCart.setSize(orderedProduct.getSize());
                shoppingCart.setCustomer(order.getCustomer());
                shoppingCartRepository.save(shoppingCart);

            }
            // Delete the order
            ordersRepository.delete(order);
        } else {
            throw new RuntimeException("Order not found");
        }
    }
}
