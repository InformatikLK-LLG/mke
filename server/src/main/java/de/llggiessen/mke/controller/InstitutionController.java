package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.InstitutionRepository;
import de.llggiessen.mke.schema.Institution;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/institution")
public class InstitutionController {

    @Autowired
    InstitutionRepository repository;

    @GetMapping("")
    public Iterable<Institution> getInstitution() {

        return repository.findAll();
    }

    @GetMapping(value = "",params = {"instCode"})
    public Institution getInstitutionByID(@RequestParam String instCode){
        return repository.findInstitutionByID(instCode);
    }

    @GetMapping(value = "",params = {"svb"})
    public Iterable<Institution> getInstitutionsBySvb(@RequestParam boolean svb){
        return repository.findInstitutionBySvb(svb);
    }


}
