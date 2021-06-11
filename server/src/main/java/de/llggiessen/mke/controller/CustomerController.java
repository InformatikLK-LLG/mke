package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.CustomerRepository;
import de.llggiessen.mke.schema.Customer;
import org.springframework.beans.factory.annotation.Autowired;

public class CustomerController {

    @Autowired
    CustomerRepository repository;
}
