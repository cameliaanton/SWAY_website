package com.example.website.service;


import com.example.website.EmailSenderService;
import com.example.website.dto.*;
import com.example.website.entity.*;
import com.example.website.helpers.OrderStatus;
import com.example.website.helpers.Size;
import com.example.website.repository.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.example.website.Utils.generateSalt;
import static com.example.website.Utils.hashPassword;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final OrdersRepository ordersRepository;
    private final OrderedProductsRepository orderedProductsRepository;
    private final PasswordRepository passwordRepository;
    private final ProductRepository productRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final FavoriteProductsRepository favoriteProductsRepository;
    @Autowired
    private EmailSenderService emailSenderService;

    public User addEmployee(User user) {
        validateUser(user);
        user.setRole(2);
        return userRepository.save(user);
    }

    public Long registerEmployee(RegisterClient registerClient) {
        if (registerClient.getPassword().isBlank() || registerClient.getRepeatPassword().isBlank())
            throw new RuntimeException("Invalid Password");
        if (!registerClient.getPassword().equals(registerClient.getRepeatPassword()))
            throw new RuntimeException("Password is not the same!");
        Long userId = addEmployee(registerClient.getUser()).getId();
        byte[] salt = generateSalt();
        String hashedPassword = hashPassword(registerClient.getPassword(), salt);
        Password password = new Password(null, userId, hashedPassword, salt);
        passwordRepository.save(password);
        return userId;
    }

    public User addAdmin(User user) {
        validateUser(user);
        user.setRole(0);
        User saved = userRepository.save(user);
        return saved;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public Long registerAdmin(RegisterClient registerClient) {
        if (registerClient.getPassword().isBlank() || registerClient.getRepeatPassword().isBlank())
            throw new RuntimeException("Invalid Password");
        if (!registerClient.getPassword().equals(registerClient.getRepeatPassword()))
            throw new RuntimeException("Password is not the same!");
        Long userId = addAdmin(registerClient.getUser()).getId();
        byte[] salt = generateSalt();
        String hashedPassword = hashPassword(registerClient.getPassword(), salt);
        Password password = new Password(null, userId, hashedPassword, salt);
        passwordRepository.save(password);
        return userId;
    }

    public Optional<User> getUser(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUser(Long id) {
        return userRepository.findById(id);
    }

    public User login(Login login) {
        Optional<User> userLogin = userRepository.findByUsername(login.getUsername());
        if (userLogin.isEmpty())
            userLogin = userRepository.findByEmail(login.getUsername());
        if (userLogin.isEmpty())
            throw new RuntimeException("Username or email incorrect");
        User user = userLogin.get();
        Optional<Password> optionalPassword = passwordRepository.findByUserId(user.getId());
        if (optionalPassword.isEmpty())
            throw new RuntimeException("User or password incorrect!");
        Password password = optionalPassword.get();
        String hashedPassword = hashPassword(login.getPassword(), password.getSalt());
        if (hashedPassword == null || password.getPassword().compareTo(hashedPassword) != 0)
            throw new RuntimeException("User or password incorrect!");
        System.out.println(user);
        return user;
    }

    public User addClient(User user) {
        validateUser(user);
        user.setRole(User.CUSTOMER);
        return userRepository.save(user);
    }

    @Transactional
    public Optional<Orders> confirmOrder(Long orderId, String deliveryMethod, String paymentMethod, String address, Double totalPayment) {
        Optional<Orders> optionalOrder = ordersRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Orders order = optionalOrder.get();
            updateOrderDetails(order, deliveryMethod, paymentMethod, address, totalPayment);
            updateInventory(order);
            sendOrderConfirmationEmail(order);
            return Optional.of(ordersRepository.save(order));
        }
        return Optional.empty();
    }

    private void updateOrderDetails(Orders order, String deliveryMethod, String paymentMethod, String address, Double totalPayment) {
        order.setDelivery_method(deliveryMethod);
        order.setPayMethod(paymentMethod);
        order.setDeliveryAddress(address);
        order.setStatus(OrderStatus.PAYED);
        order.setPaymentSum(totalPayment);
    }

    private void updateInventory(Orders order) {
        for (OrderedProducts orderedProduct : order.getOrderedProducts()) {
            Products product = productRepository.findById(orderedProduct.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            product.getInventories().forEach(inventory -> {
                if (inventory.getSize().equals(orderedProduct.getSize())) {
                    if (inventory.getQuantity() < orderedProduct.getQuantity()) {
                        throw new RuntimeException("Insufficient inventory for product: " + product.getName());
                    }
                    inventory.setQuantity(inventory.getQuantity() - orderedProduct.getQuantity());
                }
            });
            productRepository.save(product); // Save the updated product inventory
        }
    }

    // Add this method to your UserService.java
   /* @Transactional
    public void returnProductsToCart(Long userId, List<ReturnProductDTO> products) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer) {
            Customer customer = (Customer) optionalUser.get();
            for (ReturnProductDTO product : products) {
                Optional<ShoppingCart> existingCartItem = shoppingCartRepository.findByCustomerIdAndProductId(customer.getId(), product.getProductId());
                if (existingCartItem.isPresent()) {
                    ShoppingCart cartItem = existingCartItem.get();
                    cartItem.setQuantity(cartItem.getQuantity() + product.getQuantity());
                } else {
                    ShoppingCart newCartItem = new ShoppingCart();
                    newCartItem.setProductId(product.getProductId());
                    newCartItem.setQuantity(product.getQuantity());
                    newCartItem.setCustomer(customer);
                    shoppingCartRepository.save(newCartItem);
                    customer.getShoppingCart().add(newCartItem);
                }
            }
            userRepository.save(customer);
        }
    }
    */
    private void sendOrderConfirmationEmail(Orders order) {
        String emailText = generateEmailTextOrder(order);
        emailSenderService.sendEmail(order.getCustomer().getEmail(), "Sway Order Confirmation", emailText);
    }

    private String generateEmailTextOrder(Orders order) {
        StringBuilder text = new StringBuilder();
        text.append("Thank you for your order!\n\n")
                .append("Order ID: ").append(order.getId()).append("\n")
                .append("Total Payment: ").append(order.getPaymentSum()).append("\n")
                .append("Delivery Method: ").append(order.getDelivery_method()).append("\n")
                .append("Payment Method: ").append(order.getPayMethod()).append("\n")
                .append("Delivery Address: ").append(order.getDeliveryAddress()).append("\n\n")
                .append("Products:\n");

        order.getOrderedProducts().forEach(orderedProduct -> {
            Products product = productRepository.findById(orderedProduct.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            text.append(product.getName())
                    .append(" (")
                    .append(orderedProduct.getQuantity())
                    .append(" x ").append(product.getPrice())
                    .append(" RON)\n");
        });

        return text.toString();
    }

    public List<Orders> getAllOrders(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer customer) {
            return customer.getOrdersList();
        }
        return null;
    }

    public Optional<List<Products>> getOrdersProducts(Long orderId) {
        Optional<Orders> orders = ordersRepository.findById(orderId);
        List<OrderedProducts> orderedProducts = orders.get().getOrderedProducts();
        List<Products> products = orderedProducts.stream()
                .map(p -> productRepository.findById(p.getProductId()).get())
                .toList();
        return Optional.of(products);
    }

    public Optional<Orders> getOrderInProcessing(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer) {
            Customer customer = (Customer) optionalUser.get();
            List<Orders> ordersList = customer.getOrdersList();
            return ordersList.stream()
                    .filter(order -> order.getStatus().equals(OrderStatus.IN_PROGRESS))
                    .findFirst();
        }
        return Optional.empty();
    }

    @Transactional
    public void addOrder(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer) {
            Customer customer = (Customer) optionalUser.get();
            List<ShoppingCart> cartList = shoppingCartRepository.findByCustomerId(userId);
            if (cartList.isEmpty()) {
                throw new RuntimeException("Shopping cart is empty");
            }
            double totalSum = cartList.stream()
                    .mapToDouble(item -> productRepository.findById(item.getProductId())
                            .map(product -> item.getQuantity() * product.getPrice())
                            .orElseThrow(() -> new RuntimeException("Product not found")))
                    .sum();

            Orders order = new Orders();
            order.setCustomer(customer);
            order.setPaymentSum(totalSum);

            order.setStatus(OrderStatus.IN_PROGRESS);  // Ensure this value is correctly set
            order.setDateTime(LocalDateTime.now());

            order.setDeliveryAddress("");
            order.setDelivery_method("");
            order.setPayMethod("");

            ordersRepository.save(order);

            for (ShoppingCart cartItem : cartList) {
                OrderedProducts orderedProduct = new OrderedProducts();
                orderedProduct.setOrder(order);
                orderedProduct.setProductId(cartItem.getProductId());
                orderedProduct.setQuantity(cartItem.getQuantity());
                orderedProduct.setSize(cartItem.getSize());
                orderedProduct.setProductPrice(productRepository.findById(cartItem.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"))
                        .getPrice());
                orderedProductsRepository.save(orderedProduct);
            }

            shoppingCartRepository.deleteAll(cartList);
        }
    }

    @Transactional
    public void updateQuantity(Long cartItemId, Integer quantity) {
        ShoppingCart shoppingCart = shoppingCartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Shopping cart item not found"));

        Products product = productRepository.findById(shoppingCart.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Inventory inventory = product.getInventories().stream()
                .filter(inv -> inv.getSize().equals(shoppingCart.getSize()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Inventory for the specified size not found"));

        if (inventory.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient inventory for product: " + product.getName());
        }

        shoppingCart.setQuantity(quantity);
        shoppingCartRepository.save(shoppingCart);
    }

    public Optional<List<ShoppingCartItemDTO>> getShoppingCartsProductDTO(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer) {
            Customer customer = (Customer) optionalUser.get();
            List<ShoppingCart> cartItems = customer.getShoppingCart();
            List<ShoppingCartItemDTO> cartDTOList = new ArrayList<>();

            for (ShoppingCart cart : cartItems) {
                Optional<Products> productOpt = productRepository.findById(cart.getProductId());
                if (productOpt.isPresent()) {
                    Products product = productOpt.get();
                    cartDTOList.add(new ShoppingCartItemDTO(
                            cart.getId(),
                            product,
                            cart.getSize(),
                            cart.getQuantity(),
                            product.getPrice()
                    ));
                }
            }
            return Optional.of(cartDTOList);
        }
        return Optional.empty();
    }

    public Optional<List<ShoppingCart>> getShoppingCartsProduct(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer) {
            Customer customer = (Customer) optionalUser.get();
            return Optional.of(customer.getShoppingCart());
        }
        return Optional.empty();
    }

    public Optional<User> addToShoppingCartProduct(Long userId, Long productId, Integer quantity, Size size) {
        Optional<User> optionalUser = userRepository.findById(userId);
        System.out.println("buna ziua");
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer) {
            Customer customer = (Customer) optionalUser.get();
            System.out.println("oo customer");
            Optional<ShoppingCart> existingCartItem = shoppingCartRepository.findByCustomerIdAndProductIdAndSize(customer.getId(), productId, size);
            if (existingCartItem.isPresent()) {

                ShoppingCart cartItem = existingCartItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
            } else {
                System.out.println("new");
                ShoppingCart newCartItem = new ShoppingCart();
                newCartItem.setProductId(productId);
                newCartItem.setQuantity(quantity);
                newCartItem.setSize(size);
                newCartItem.setCustomer(customer);
                shoppingCartRepository.save(newCartItem);
                customer.getShoppingCart().add(newCartItem);
            }
            userRepository.save(customer);
            return Optional.of(customer);
        }
        return Optional.empty();
    }

    public Optional<User> addFavoriteProduct(Long userId, Long productId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer) {
            Customer customer = (Customer) optionalUser.get();

            boolean alreadyExists = customer.getFavoriteProducts().stream()
                    .anyMatch(p -> p.getProductId().equals(productId));

            if (alreadyExists) {
                throw new RuntimeException("Product is already in the favorites list.");
            }

            FavoriteProducts favoriteProducts = new FavoriteProducts();
            favoriteProducts.setProductId(productId);
            favoriteProducts.setCustomer(customer);
            customer.getFavoriteProducts().add(favoriteProducts);
            favoriteProductsRepository.save(favoriteProducts);
            userRepository.save(customer);
            return Optional.of(customer);
        }
        return Optional.empty();
    }

    public Optional<List<FavoriteProducts>> getFavoriteProduct(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer) {
            Customer customer = (Customer) optionalUser.get();
            return Optional.of(customer.getFavoriteProducts());
        }
        return Optional.empty();
    }

    public Optional<List<FavoriteProductsDTO>> getFavoriteProductDTO(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer) {
            Customer customer = (Customer) optionalUser.get();
            List<FavoriteProducts> favoriteProductsList = favoriteProductsRepository.findByCustomerId(userId);
            List<FavoriteProductsDTO> favoriteProductsDTOList = favoriteProductsList.stream()
                    .map(favorite -> {
                        Products product = productRepository.findById(favorite.getProductId()).orElse(null);
                        return new FavoriteProductsDTO(favorite.getId(), favorite.getProductId(), product);
                    }).collect(Collectors.toList());
            return Optional.of(favoriteProductsDTOList);
        }
        return Optional.empty();
    }

    public Optional<User> deleteFavoriteProduct(Long userId, Long productId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer) {
            Customer customer = (Customer) optionalUser.get();

            Optional<FavoriteProducts> favoriteProductToDelete = customer.getFavoriteProducts().stream()
                    .filter(p -> p.getProductId().equals(productId))
                    .findFirst();

            if (favoriteProductToDelete.isPresent()) {
                customer.getFavoriteProducts().remove(favoriteProductToDelete.get());

                favoriteProductsRepository.delete(favoriteProductToDelete.get());

                userRepository.save(customer);
                return Optional.of(customer);
            }
        }
        return Optional.empty();
    }

    public Optional<User> updateCustomer(Long id, CustomerDTO customerDTO) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent() && optionalUser.get() instanceof Customer) {
            Customer customer = (Customer) optionalUser.get();
            customer.setName(customerDTO.getFirstName() + " " + customerDTO.getLastName());
            customer.setAddress(customerDTO.getAddress());
            customer.setTelephone(customerDTO.getTelephone());
            customer.setGender(customerDTO.getGender());
            customer.setSubscribe(customerDTO.getSubscribe());
            customer.setDateBirth(customerDTO.getDateBirth());
            customer.setEmail(customerDTO.getEmail());
            userRepository.save(customer);
            return Optional.of(customer);
        }
        return Optional.empty();
    }

    public Long register(RegisterClient registerClient) {
        if (registerClient.getPassword().isBlank() || registerClient.getRepeatPassword().isBlank())
            throw new RuntimeException("Invalid Password");
        if (!registerClient.getPassword().equals(registerClient.getRepeatPassword()))
            throw new RuntimeException("Password is not the same!");
        Long userId = addClient(registerClient.getUser()).getId();
        byte[] salt = generateSalt();
        String hashedPassword = hashPassword(registerClient.getPassword(), salt);
        Password password = new Password(null, userId, hashedPassword, salt);
        passwordRepository.save(password);
        return userId;
    }

    private void validateUser(User user) {
        if (user.getName().isBlank()) {
            throw new RuntimeException("Invalid name!");
        }
        if (user.getUsername().isBlank()) {
            throw new RuntimeException("Invalid username!");
        }
        if (user.getEmail().isBlank() || !validEmail(user.getEmail())) {
            throw new RuntimeException("Invalid Email!");
        }

    }

    private boolean validEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email.matches(emailRegex);
    }

    public Optional<User> changePassword(String email, String password, String repeatPassword) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            if (password == null || repeatPassword == null || password.isBlank() || repeatPassword.isBlank()) {
                throw new RuntimeException("Invalid Password");
            }
            if (!password.equals(repeatPassword)) {
                throw new RuntimeException("Passwords do not match");
            }
            Optional<Password> optionalPassword = passwordRepository.findByUserId(existingUser.get().getId());
            if (optionalPassword.isPresent()) {
                Password userPassword = optionalPassword.get();
                String hashedPassword = hashPassword(password, userPassword.getSalt());
                userPassword.setPassword(hashedPassword);
                passwordRepository.save(userPassword);
            }
            return existingUser;
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void deleteUser(Long userId) {
        System.out.println("delete" + userId);
        userRepository.deleteById(userId);
    }

    public User updateUser(Long userId, User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            existingUser.setName(updatedUser.getName());
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setType(updatedUser.getType());
            return userRepository.save(existingUser);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public int getCartCount(Long userId) {
        return shoppingCartRepository.countByCustomer_Id(userId);
    }

    public int getFavoriteCount(Long userId) {
        return favoriteProductsRepository.countByCustomer_Id(userId);
    }
}
