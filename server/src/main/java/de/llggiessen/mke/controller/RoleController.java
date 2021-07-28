package de.llggiessen.mke.controller;

import java.util.Collection;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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

    public boolean isSuperfluous(Role role) {
        Set<Role> roles = roleRepository.findAll();
        // Deletes all roles which have not equal privileges such that, if there is a
        // role left, the role is a duplicate
        roles.removeIf((value) -> !value.getPrivileges().equals(role.getPrivileges()));

        return (roles.size() > 0 && !roleRepository.findById(role.getId()).isPresent());
    }

    public boolean isInUsersScope(Role role) {
        Collection<? extends GrantedAuthority> privileges = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities();
        return (privileges.containsAll(role.getPrivileges()));
    }

    public boolean isPresent(Role role) {
        return roleRepository.findById(role.getId()).isPresent();
    }

    @PostMapping("")
    @PreAuthorize("hasAuthority('ROLE_WRITE')")
    public Role createRole(@RequestBody Role role) {

        if (role.getPrivileges() == null || role.getPrivileges().size() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have to specify privileges.");
        }

        if (!isInUsersScope(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "You are not allowed to assign privileges you do not have yourself.");

        if (isPresent(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rolle mit diesem Namen existiert bereits.");

        if (isSuperfluous(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Rolle mit gleichen Berechtigungen existiert bereits.");

        role.setId(role.getId().toUpperCase());
        return roleRepository.save(role);
    }

    @PutMapping("")
    @PreAuthorize("hasAuthority('ROLE_WRITE')")
    public Role updateRole(@RequestBody Role role) {

        if (!isPresent(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There is no role with this name.");

        if (role.getPrivileges() == null || role.getPrivileges().size() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have to specify privileges.");
        }

        if (!isInUsersScope(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "You are not allowed to assign privileges you do not have yourself.");

        if (isSuperfluous(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Rolle mit gleichen Berechtigungen existiert bereits.");

        return roleRepository.save(role);
    }

}