package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.CustomerRepository;
import de.llggiessen.mke.repository.InstitutionRepository;
import de.llggiessen.mke.schema.Customer;
import de.llggiessen.mke.schema.Institution;
import de.llggiessen.mke.utils.FormValidation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController()
@RequestMapping(path = "/customer")
@CrossOrigin("*")
public class CustomerController {

    @Autowired
    private CustomerRepository repository;

    @Autowired
    private InstitutionRepository institutionRepository;

    @GetMapping("")
    @PreAuthorize("hasAuthority('CUSTOMER_READ')")
    public Iterable<Customer> getCustomers(
            @RequestParam(value = "email", required = false, defaultValue = "") String email,
            @RequestParam(value = "firstName", required = false, defaultValue = "") String firstName,
            @RequestParam(value = "lastName", required = false, defaultValue = "") String lastName) {
        return repository.findAllByAttributes(email, firstName, lastName);
    }

    @GetMapping(value = "{id}")
    @PreAuthorize("hasAuthority('CUSTOMER_READ')")
    public Customer getCustomerByID(@PathVariable long id) {
        return repository.findById(id).orElseThrow(() -> {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There is no customer with this id.");
        });
    }

    @DeleteMapping(value = "", params = { "email" })
    @PreAuthorize("hasAuthority('CUSTOMER_WRITE')")
    public void deleteByEmail(@RequestParam String email) {
        repository.deleteByEmail(email);
    }

    @DeleteMapping(value = "", params = { "id" })
    @PreAuthorize("hasAuthority('CUSTOMER_WRITE')")
    public void deleteById(@RequestParam long id) {
        repository.deleteById(id);
    }

    @PostMapping("")
    @PreAuthorize("hasAuthority('CUSTOMER_WRITE')")
    public Customer createCustomer(@RequestBody Customer customer) {
        FormValidation.validateCustomer(customer);

        Institution institution = institutionRepository.findById(customer.getInstitution().getId()).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "There is no institution with this id."));
        institution.addCustomer(customer);
        customer.setInstitution(institution);

        try {
            return repository.save(customer);
        } catch (Exception e) {
            String message = "Could not save customer.";
            if (repository.findByEmail(customer.getEmail()).isPresent()) {
                message = "Diese Email-Addresse ist bereits vergeben. Versuche eine andere.";
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    @PutMapping("")
    @PreAuthorize("hasAuthority('CUSTOMER_WRITE')")
    public Customer updateCustomer(@RequestBody Customer customer) {
        FormValidation.validateCustomer(customer);

        if (!repository.existsById(customer.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "There is no customer with this id. Maybe you meant to create a new customer using a POST request.");
        try {
            return repository.save(customer);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not update customer.");
        }
    }
}