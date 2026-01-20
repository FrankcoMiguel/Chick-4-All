package com.frankslab.chick4all.controller;

import com.frankslab.chick4all.model.Order;
import com.frankslab.chick4all.repository.OrderRepository;
import com.frankslab.chick4all.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAll();
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable("id") String id) {
        Optional<Order> orderData = orderRepository.findById(id);
        
        if (orderData.isPresent()) {
            return new ResponseEntity<>(orderData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }\n\n    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomer(@PathVariable("customerId") String customerId) {
        try {
            return customerRepository.findById(customerId)
                    .map(customer -> {
                        List<Order> orders = orderRepository.findByCustomerOrderByOrderDateDesc(customer);
                        return new ResponseEntity<>(orders, HttpStatus.OK);
                    })
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable("status") Order.OrderStatus status) {
        try {
            List<Order> orders = orderRepository.findByStatusOrderByOrderDateDesc(status);
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody Order order) {
        try {
            if (order.getOrderDate() == null) {
                order.setOrderDate(LocalDateTime.now());
            }
            if (order.getStatus() == null) {
                order.setStatus(Order.OrderStatus.PENDING);
            }
            
            Order savedOrder = orderRepository.save(order);
            return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }\n\n    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable("id") String id, @Valid @RequestBody Order order) {
        Optional<Order> orderData = orderRepository.findById(id);
        
        if (orderData.isPresent()) {
            Order existingOrder = orderData.get();
            existingOrder.setOrderDetails(order.getOrderDetails());
            existingOrder.setTotalAmount(order.getTotalAmount());
            existingOrder.setStatus(order.getStatus());
            existingOrder.setNotes(order.getNotes());
            existingOrder.setDeliveryAddress(order.getDeliveryAddress());
            
            return new ResponseEntity<>(orderRepository.save(existingOrder), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable("id") String id, 
                                                   @RequestBody StatusUpdateRequest request) {
        Optional<Order> orderData = orderRepository.findById(id);
        
        if (orderData.isPresent()) {
            Order existingOrder = orderData.get();
            existingOrder.setStatus(request.getStatus());
            
            return new ResponseEntity<>(orderRepository.save(existingOrder), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteOrder(@PathVariable("id") String id) {
        try {
            orderRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/stats/status-counts")
    public ResponseEntity<?> getOrderStatusCounts() {
        try {
            OrderStatistics stats = new OrderStatistics();
            stats.setPending(orderRepository.countByStatus(Order.OrderStatus.PENDING));
            stats.setConfirmed(orderRepository.countByStatus(Order.OrderStatus.CONFIRMED));
            stats.setPreparing(orderRepository.countByStatus(Order.OrderStatus.PREPARING));
            stats.setReady(orderRepository.countByStatus(Order.OrderStatus.READY));
            stats.setDelivered(orderRepository.countByStatus(Order.OrderStatus.DELIVERED));
            stats.setCancelled(orderRepository.countByStatus(Order.OrderStatus.CANCELLED));
            
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Inner classes
    public static class StatusUpdateRequest {
        private Order.OrderStatus status;
        
        public Order.OrderStatus getStatus() { return status; }
        public void setStatus(Order.OrderStatus status) { this.status = status; }
    }

    public static class OrderStatistics {
        private long pending;
        private long confirmed;
        private long preparing;
        private long ready;
        private long delivered;
        private long cancelled;

        // Getters and setters
        public long getPending() { return pending; }
        public void setPending(long pending) { this.pending = pending; }
        public long getConfirmed() { return confirmed; }
        public void setConfirmed(long confirmed) { this.confirmed = confirmed; }
        public long getPreparing() { return preparing; }
        public void setPreparing(long preparing) { this.preparing = preparing; }
        public long getReady() { return ready; }
        public void setReady(long ready) { this.ready = ready; }
        public long getDelivered() { return delivered; }
        public void setDelivered(long delivered) { this.delivered = delivered; }
        public long getCancelled() { return cancelled; }
        public void setCancelled(long cancelled) { this.cancelled = cancelled; }
    }
}