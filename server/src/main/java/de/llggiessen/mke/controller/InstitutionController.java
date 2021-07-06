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
    public Iterable<Institution> getInsttitutions(){
        return repository.findAll();
    }

    @GetMapping(value = "", params = {"id"})
    public Institution getInstitutionByID(@RequestParam String id) {
        return repository.findById(id).orElseThrow(() -> {throw new ResponseStatusException(HttpStatus.BAD_REQUEST);});
    }

    @GetMapping(value = "", params = {"svb"})
    public Iterable<Institution> getInstitutionsBySvb(@RequestParam boolean svb) {
        return repository.findInstitutionsBySvb(svb);
    }

    @GetMapping(value = "", params = {"name"})
    public Iterable<Institution> getInstitutionsByName(@RequestParam String name) {
        return repository.findInstitutions(name);
    }

    @DeleteMapping(value = "",params ={"id"})
    public Institution deleteInstitutionByID(@RequestParam String id) {
        return repository.deleteInstitutionByID(id);
    }

}
