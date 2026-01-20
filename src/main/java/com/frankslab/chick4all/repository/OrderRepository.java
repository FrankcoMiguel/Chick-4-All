package com.frankslab.chick4all.repository;

import com.frankslab.chick4all.model.Order;
import com.frankslab.chick4all.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    
    List<Order> findByCustomer(Customer customer);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Order> findByCustomerOrderByOrderDateDesc(Customer customer);
    
    List<Order> findByStatusOrderByOrderDateDesc(Order.OrderStatus status);
    
    long countByStatus(Order.OrderStatus status);
}