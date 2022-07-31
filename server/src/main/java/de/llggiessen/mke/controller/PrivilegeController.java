package de.llggiessen.mke.controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.llggiessen.mke.repository.PrivilegeRepository;
import de.llggiessen.mke.schema.Privilege;

@RestController
@RequestMapping("/privilege")
public class PrivilegeController {

    @Autowired
    PrivilegeRepository privilegeRepository;

    @GetMapping("")
    public Iterable<Privilege> getPrivileges() {
        Set<Privilege> privileges = privilegeRepository.findAll();
        privileges.retainAll(SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        return privileges;
    }

}