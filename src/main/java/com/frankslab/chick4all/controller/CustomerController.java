package com.frankslab.chick4all.controller;

import com.frankslab.chick4all.model.Customer;
import com.frankslab.chick4all.model.Platform;
import com.frankslab.chick4all.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        try {
            List<Customer> customers = customerRepository.findAll();
            return new ResponseEntity<>(customers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable("id") String id) {
        Optional<Customer> customerData = customerRepository.findById(id);
        
        if (customerData.isPresent()) {
            return new ResponseEntity<>(customerData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomers(@RequestParam(required = false) String name,
                                                         @RequestParam(required = false) Platform platform) {
        try {
            List<Customer> customers;
            
            if (name != null && !name.isEmpty()) {
                customers = customerRepository.findByNameContainingIgnoreCase(name);
            } else if (platform != null) {
                customers = customerRepository.findByPlatform(platform);
            } else {
                customers = customerRepository.findAll();
            }
            
            return new ResponseEntity<>(customers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) {
        try {
            if (customer.getJoinDate() == null) {
                customer.setJoinDate(LocalDate.now());
            }
            Customer savedCustomer = customerRepository.save(customer);
            return new ResponseEntity<>(savedCustomer, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable("id") String id, @Valid @RequestBody Customer customer) {
        Optional<Customer> customerData = customerRepository.findById(id);
        
        if (customerData.isPresent()) {
            Customer existingCustomer = customerData.get();
            existingCustomer.setName(customer.getName());
            existingCustomer.setBirthDate(customer.getBirthDate());
            existingCustomer.setAddress(customer.getAddress());
            existingCustomer.setPlatform(customer.getPlatform());
            
            return new ResponseEntity<>(customerRepository.save(existingCustomer), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCustomer(@PathVariable("id") String id) {
        try {
            customerRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}