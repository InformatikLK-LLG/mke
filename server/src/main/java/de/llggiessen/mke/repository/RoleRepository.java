package de.llggiessen.mke.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import de.llggiessen.mke.schema.Role;

@Repository
@RepositoryRestResource(exported = false)
public interface RoleRepository extends CrudRepository<Role, String> {

    Set<Role> findAll();

    Optional<Set<Role>> findByIdIgnoreCaseContaining(String id);
}
