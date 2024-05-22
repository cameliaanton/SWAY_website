package com.example.website.service;

import com.example.website.entity.*;
import com.example.website.repository.OrdersRepository;
import com.example.website.repository.ProductRepository;
import com.example.website.repository.ShoppingCartRepository;
import com.example.website.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Autowired
    private ProductRepository productRepository;

    private UserRepository userRepository;

    public  void deleteOrder(Long orderId){
        ordersRepository.delete(ordersRepository.getReferenceById(orderId));
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
