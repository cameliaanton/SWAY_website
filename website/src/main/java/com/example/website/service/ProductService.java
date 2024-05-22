package com.example.website.service;

import com.example.website.entity.Inventory;
import com.example.website.entity.Products;
import com.example.website.helpers.Color;
import com.example.website.helpers.ProductGender;
import com.example.website.helpers.Size;
import com.example.website.repository.InventoryRepository;
import com.example.website.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productsRepository;
    private final InventoryRepository inventoryRepository;
    public HashMap<Color,Products> colorProducts(Products products){
        List<Products> productsColorList= findDifferentColors(products);
        HashMap<Color,Products> colorProductsHashMap= new HashMap<>();
        for(Products p: productsColorList){
            colorProductsHashMap.put(p.getColor(),p);
        }
        return colorProductsHashMap;
    }
    public List<Products> getProductsByGender(ProductGender productGender){
        List<Products> productsList=getProducts();
        return productsList.stream().filter(p-> (p.getGender().equals(productGender)) || (p.getGender().equals("UNISEX")))
                .collect(Collectors.toList());
    }
    public List<Products> findDifferentColors(Products products){
        List<Products> productsList= getProducts();
        return productsList.stream().filter(p->p.getName().equals(products.getName()))
                .filter(p->p.getGender().equals(products.getGender()))
                .filter(p->!p.getColor().equals(products.getColor()))
                .collect(Collectors.toList());
    }
    public List<Products> sortByAscendingPrice(List<Products> productsList){
        return productsList.stream().sorted(Comparator.comparing(Products::getPrice))
                .collect(Collectors.toList());
    }
    public List<Products> sortByDownwardPrice(List<Products> productsList){
        return productsList.stream().sorted(Comparator.comparing(Products::getPrice))
                .collect(Collectors.toList()).reversed();
    }
    public List<Products> sortByShuffleProducts(List<Products> productsList){
        Collections.shuffle(productsList);
        return productsList;
    }
    public Products getProductById(Long id) {
        return productsRepository.findById(id).orElse(null);
    }

    public List<Products> getProducts() {
        List<Products> products = productsRepository.findAll();
        System.out.println("Fetched products from repository: " + products.size());
        return products;
    }
    @Transactional
    public Products addProduct(Products product) {
        System.out.println("Saving product: " + product);

        List<Inventory> inventories = product.getInventories();

        product.setInventories(new ArrayList<>());

        Products savedProduct = productsRepository.save(product);

        for (Inventory inventory : inventories) {
            inventory.setProduct(savedProduct);
            System.out.println("Updated inventory: " + inventory);
        }

        inventoryRepository.saveAll(inventories);

        savedProduct.setInventories(inventories);

        return savedProduct;
    }

    public String deleteProduct(Long id) {
        productsRepository.deleteById(id);
        return String.format("Product with ID: %d has been deleted", id);
    }

    public Products updateProduct(Long id,Products product) {
        Products existingProduct = productsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        existingProduct.setPrice(product.getPrice());
        existingProduct.setName(product.getName());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setSubCategories(product.getSubCategories());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setGender(product.getGender());
        existingProduct.setImageUrls(product.getImageUrls());
        existingProduct.setColor(product.getColor());

        // Update inventories
        existingProduct.getInventories().clear();
        for (Inventory inventory : product.getInventories()) {
            inventory.setProduct(existingProduct);
            existingProduct.getInventories().add(inventory);
        }

        return productsRepository.save(existingProduct);
    }
    public List<Inventory> getInventoryByProductAndSize(Products product, Size size) {
        return inventoryRepository.findByProductAndSize(product, size);
    }

    public List<Inventory> getInventoryByProduct(Products product) {
        return inventoryRepository.findByProduct(product);
    }

}
