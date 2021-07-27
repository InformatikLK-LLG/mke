package de.llggiessen.mke.controller;

import java.util.Collection;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.llggiessen.mke.repository.RoleRepository;
import de.llggiessen.mke.schema.Role;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    RoleRepository roleRepository;

    @GetMapping("")
    public Iterable<Role> getRoles() {
        Collection<? extends GrantedAuthority> privileges = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities();
        Set<Role> roles = roleRepository.findAll();
        roles.removeIf((role) -> !privileges.containsAll(role.getPrivileges()));
        return roles;
    }
}