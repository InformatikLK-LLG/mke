package de.llggiessen.mke.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import de.llggiessen.mke.schema.Role;

@Repository
@RepositoryRestResource(exported = false)
public interface RoleRepository extends CrudRepository<Role, Long> {

    Set<Role> findAll();

    boolean existsByName(String name);

    Optional<Role> findByName(String name);

    Optional<Set<Role>> findByNameIgnoreCaseContaining(String name);
}
