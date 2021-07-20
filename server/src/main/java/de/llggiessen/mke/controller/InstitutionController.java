package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.InstitutionRepository;
import de.llggiessen.mke.schema.Customer;
import de.llggiessen.mke.schema.Institution;
import de.llggiessen.mke.utils.FormValidation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController()
@RequestMapping(path = "/institution")
@CrossOrigin(origins = "*")
public class InstitutionController {

    @Autowired
    InstitutionRepository repository;

    @GetMapping("")
    public Iterable<Institution> getInstitutions() {
        return repository.findAll();
    }

    @GetMapping(value = "", params = { "id" })
    public Institution getInstitutionByID(@RequestParam String id) {
        return repository.findById(id).orElseThrow(() -> {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not find Institution");
        });
    }

    @GetMapping(value = "", params = { "svb" })
    public Iterable<Institution> getInstitutionsBySvb(@RequestParam boolean svb) {
        return repository.findInstitutionsBySvb(svb);
    }

    @GetMapping(value = "", params = { "name" })
    public Iterable<Institution> getInstitutionsByName(@RequestParam String name) {
        return repository.findInstitutions(name);
    }

    @GetMapping(value = "{instCode}/customer")
    public Iterable<Customer> getCustomersOfInstitution(@PathVariable String instCode) {
        return repository.findById(instCode).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Could not find an institution with this id.")).getCustomers();
    }

    @DeleteMapping(value = "", params = { "id" })
    public void deleteInstitutionByID(@RequestParam String id) {
        try {
            repository.deleteById(id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Institution could not be deleted.");
        }
    }

    @PostMapping(value = "")
    public Institution createInstitution(@RequestBody Institution institution) {
        FormValidation.validateInstitution(institution);

        if (repository.existsById(institution.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id already exists.");
        } else {
            try {
                return repository.save(institution);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not save institution.");
            }
        }
    }

    @PutMapping(value = "")
    public Institution updateInstitution(@RequestBody Institution institution) {
        FormValidation.validateInstitution(institution);

        if (!repository.existsById(institution.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "There is no institution with this id. Maybe you meant to create a new institution using a POST request.");
        try {
            return repository.save(institution);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not update institution.");
        }

    }
}
