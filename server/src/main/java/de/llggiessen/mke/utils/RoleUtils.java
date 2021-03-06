package de.llggiessen.mke.utils;

import java.util.Collection;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import de.llggiessen.mke.repository.RoleRepository;
import de.llggiessen.mke.schema.Privilege;
import de.llggiessen.mke.schema.Role;

@Component
public class RoleUtils {

    @Autowired
    RoleRepository roleRepository;

    public boolean isSuperfluous(Role role) {
        Set<Role> roles = roleRepository.findAll();
        // Deletes all roles which have not equal privileges such that, if there is a
        // role left, the role is a duplicate
        roles.removeIf((value) -> !value.getPrivileges().equals(role.getPrivileges()));

        return (roles.size() > 0 && !roleRepository.findById(role.getId()).isPresent());
    }

    public boolean isInUsersScope(long roleId) {
        return isInUsersScope(roleRepository.findById(roleId).get().getPrivileges());
    }

    public boolean isInUsersScope(Set<Privilege> privileges) {
        Collection<? extends GrantedAuthority> userPrivileges = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities();
        return userPrivileges.containsAll(privileges);
    }

    public boolean isPresent(Role role) {
        return roleRepository.existsById(role.getId());
    }
}
