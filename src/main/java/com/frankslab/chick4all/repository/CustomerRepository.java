package com.frankslab.chick4all.repository;

import com.frankslab.chick4all.model.Customer;
import com.frankslab.chick4all.model.Platform;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
    
    List<Customer> findByName(String name);
    
    List<Customer> findByPlatform(Platform platform);
    
    List<Customer> findByJoinDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Customer> findByNameContainingIgnoreCase(String name);
}