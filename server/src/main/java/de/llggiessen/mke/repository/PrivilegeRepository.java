package de.llggiessen.mke.repository;

import java.util.Set;

import org.springframework.data.repository.CrudRepository;

import de.llggiessen.mke.schema.Privilege;

public interface PrivilegeRepository extends CrudRepository<Privilege, String> {

    Set<Privilege> findAll();
}
