package de.llggiessen.mke.repository;

import java.util.Set;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import de.llggiessen.mke.schema.Privilege;

@Repository
@RepositoryRestResource(exported = false)
public interface PrivilegeRepository extends CrudRepository<Privilege, String> {

    Set<Privilege> findAll();
}
