package de.llggiessen.mke.repository;

import java.util.Set;

import org.springframework.data.repository.CrudRepository;

import de.llggiessen.mke.schema.Role;

public interface RoleRepository extends CrudRepository<Role, String> {

    Set<Role> findAll();
}
