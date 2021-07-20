package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.InstitutionRepository;
import de.llggiessen.mke.schema.Customer;
import de.llggiessen.mke.schema.Institution;

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
    public Iterable<Institution> filterInstitutions(@RequestParam(value = "name", defaultValue = "") String name,
            @RequestParam(value = "id", defaultValue = "") String id,
            @RequestParam(value = "schoolAdministrativeDistrict", defaultValue = "-1") int svb) {
        if (svb == -1)
            return repository.findInstitutionsByAttributes(name, id);
        else
            return repository.filterInstitutions(name, id, svb == 1 ? true : false);
    }

    @GetMapping(value = "{id}")
    public Institution getInstitutionByID(@PathVariable String id) {
        return repository.findById(id).orElseThrow(() -> {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not find Institution");
        });
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
    public Institution newInstitution(@RequestBody Institution newInstitution) {
        if (repository.existsById(newInstitution.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id already exists.");
        } else {
            try {
                return repository.save(newInstitution);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not save institution.");
            }
        }
    }

    @PutMapping(value = "")
    public Institution updateInstitution(@RequestBody Institution newInstitution) {
        if (!repository.existsById(newInstitution.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "There is no institution with this id. Maybe you meant to create a new institution using a POST request.");
        try {
            return repository.save(newInstitution);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not update institution.");
        }
    }
}
