package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.CustomerRepository;
import de.llggiessen.mke.schema.Customer;
import de.llggiessen.mke.schema.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(path = "/customer")
public class CustomerController {

    @Autowired
    CustomerRepository repository;

    @GetMapping("")
    public Iterable<Customer> getCustomers(@RequestParam(value = "email", required = false, defaultValue = "") String email,
                                           @RequestParam(value = "firstName", required = false, defaultValue = "") String firstName,
                                           @RequestParam(value = "lastName", required = false, defaultValue = "") String lastName){
        return repository.findAllByAttributes(email, firstName, lastName);
    }
}
