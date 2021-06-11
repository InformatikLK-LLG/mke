package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.CustomerRepository;
import de.llggiessen.mke.schema.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/customer")
public class CustomerController {

    @Autowired
    CustomerRepository repository;

    @GetMapping("")
    public Iterable<Customer> getCustomers() {
        return repository.findAll();
    }
}
