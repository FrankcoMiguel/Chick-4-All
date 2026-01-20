package com.frankslab.chick4all.controller;

import com.frankslab.chick4all.model.Item;
import com.frankslab.chick4all.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        try {
            List<Item> items = itemRepository.findAll();
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable("id") String id) {
        Optional<Item> itemData = itemRepository.findById(id);
        
        if (itemData.isPresent()) {
            return new ResponseEntity<>(itemData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Item>> getAvailableItems() {
        try {
            List<Item> items = itemRepository.findByAvailable(true);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Item>> getItemsByCategory(@PathVariable("category") String category) {
        try {
            List<Item> items = itemRepository.findByCategoryAndAvailable(category, true);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Item>> searchItems(@RequestParam(required = false) String name,
                                                 @RequestParam(required = false) String category,
                                                 @RequestParam(required = false) BigDecimal minPrice,
                                                 @RequestParam(required = false) BigDecimal maxPrice) {
        try {
            List<Item> items;
            
            if (name != null && !name.isEmpty()) {
                items = itemRepository.findByNameContainingIgnoreCase(name);
            } else if (category != null && !category.isEmpty()) {
                items = itemRepository.findByCategory(category);
            } else if (minPrice != null && maxPrice != null) {
                items = itemRepository.findByPriceBetween(minPrice, maxPrice);
            } else {
                items = itemRepository.findAll();
            }
            
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Item> createItem(@Valid @RequestBody Item item) {
        try {
            Item savedItem = itemRepository.save(item);
            return new ResponseEntity<>(savedItem, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable("id") String id, @Valid @RequestBody Item item) {
        Optional<Item> itemData = itemRepository.findById(id);
        
        if (itemData.isPresent()) {
            Item existingItem = itemData.get();
            existingItem.setName(item.getName());
            existingItem.setDescription(item.getDescription());
            existingItem.setPrice(item.getPrice());
            existingItem.setCategory(item.getCategory());
            existingItem.setAvailable(item.isAvailable());
            existingItem.setImageUrl(item.getImageUrl());
            
            return new ResponseEntity<>(itemRepository.save(existingItem), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<Item> updateItemAvailability(@PathVariable("id") String id, 
                                                       @RequestParam boolean available) {
        Optional<Item> itemData = itemRepository.findById(id);
        
        if (itemData.isPresent()) {
            Item existingItem = itemData.get();
            existingItem.setAvailable(available);
            
            return new ResponseEntity<>(itemRepository.save(existingItem), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteItem(@PathVariable("id") String id) {
        try {
            itemRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}