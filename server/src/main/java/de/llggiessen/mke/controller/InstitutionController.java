package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.InstitutionRepository;
import de.llggiessen.mke.schema.Institution;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "/institution")
public class InstitutionController {

    @Autowired
    InstitutionRepository repository;

    @GetMapping("")
    public Iterable<Institution> getInstitutions() {
        return repository.findAll();
    }

    @GetMapping(value = "", params = {"id"})
    public Institution getInstitutionByID(@RequestParam String id) {
        return repository.findById(id).orElseThrow(() -> {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not find Institution");
        });
    }

    @GetMapping(value = "", params = {"svb"})
    public Iterable<Institution> getInstitutionsBySvb(@RequestParam boolean svb) {
        return repository.findInstitutionsBySvb(svb);
    }

    @GetMapping(value = "", params = {"name"})
    public Iterable<Institution> getInstitutionsByName(@RequestParam String name) {
        return repository.findInstitutions(name);
    }

    @DeleteMapping(value = "", params = {"id"})
    public Institution deleteInstitutionByID(@RequestParam String id) {
        try {
            return repository.deleteInstitutionByID(id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Institution could not be deleted");
        }
    }

    @PostMapping(value = "")
    public Institution newInstitution(@RequestBody Institution newInstitution) {
        if (repository.existsById(newInstitution.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID already exist");
        } else {
            try {
                return repository.save(newInstitution);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not create new Institution");
            }
        }
    }

    @PutMapping(value = "")
    public Institution changeInstitution(@RequestBody Institution newInstitution) {
        if (repository.existsById(newInstitution.getId())) {
            return repository.save(newInstitution);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID does not exist");
        }
    }
}