package de.llggiessen.mke.controller;

import java.util.Collection;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import de.llggiessen.mke.repository.RoleRepository;
import de.llggiessen.mke.schema.Role;
import de.llggiessen.mke.utils.RoleUtils;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    RoleUtils roleUtils;

    @GetMapping("")
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public Iterable<Role> getRoles(@RequestParam(name = "id", defaultValue = "") String id) {
        Collection<? extends GrantedAuthority> privileges = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities();
        Set<Role> roles = roleRepository.findByIdIgnoreCaseContaining(id).orElseThrow();
        roles.removeIf((role) -> !privileges.containsAll(role.getPrivileges()));
        return roles;
    }

    @GetMapping("/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public Role getRole(@PathVariable String roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No role with this id."));
    }

    private boolean isValidRole(Role role) {
        return !(role.getPrivileges() == null || role.getPrivileges().size() == 0) || role.getId().equals("");
    }

    @PostMapping("")
    @PreAuthorize("hasAuthority('ROLE_WRITE')")
    public Role createRole(@RequestBody Role role) {

        if (!isValidRole(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not a valid role.");

        if (!roleUtils.isInUsersScope(role.getPrivileges()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "You are not allowed to assign privileges you do not have yourself.");

        if (roleUtils.isPresent(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rolle mit diesem Namen existiert bereits.");

        if (roleUtils.isSuperfluous(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Rolle mit gleichen Berechtigungen existiert bereits.");

        role.setId(role.getId().toUpperCase());
        return roleRepository.save(role);
    }

    @PutMapping("")
    @PreAuthorize("hasAuthority('ROLE_WRITE')")
    public Role updateRole(@RequestBody Role role) {

        if (!roleUtils.isPresent(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There is no role with this name.");

        if (role.getPrivileges() == null || role.getPrivileges().size() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have to specify privileges.");
        }

        if (!roleUtils.isInUsersScope(role.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "You are not allowed to assign privileges you do not have yourself.");

        if (roleUtils.isSuperfluous(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Rolle mit gleichen Berechtigungen existiert bereits.");

        return roleRepository.save(role);
    }

}