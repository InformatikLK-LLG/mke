package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.CustomerRepository;
import de.llggiessen.mke.schema.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


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

    @GetMapping(value = "", params = {"id"})
    public Customer getCustomerByID(@RequestParam Long id) {
        return repository.findById(id).orElseThrow(() -> {throw new ResponseStatusException(HttpStatus.BAD_REQUEST);});
    }

    @DeleteMapping("")
    public Customer deleteByEmail(@RequestParam(value = "email") String email) {
        return repository.deleteByEmail(email);
    }

    public void deleteById(@RequestParam(value = "id") Long Id) {
        repository.deleteById(Id);
    }
}
