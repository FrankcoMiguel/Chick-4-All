package com.frankslab.chick4all.repository;

import com.frankslab.chick4all.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    
    List<Item> findByCategory(String category);
    
    List<Item> findByAvailable(boolean available);
    
    List<Item> findByNameContainingIgnoreCase(String name);
    
    List<Item> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<Item> findByCategoryAndAvailable(String category, boolean available);
}