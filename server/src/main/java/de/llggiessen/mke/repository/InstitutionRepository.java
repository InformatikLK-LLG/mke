package de.llggiessen.mke.repository;

import de.llggiessen.mke.schema.Address;
import de.llggiessen.mke.schema.Institution;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public interface InstitutionRepository extends CrudRepository<Institution, String> {

    @Query(value = "SELECT * FROM institution WHERE institution.svb = :svb", nativeQuery = true)
    Iterable<Institution> findInstitutionsBySvb(@Param("svb") boolean svb);

    @Query(value = "SELECT * FROM institution WHERE institution.name LIKE %:name%", nativeQuery = true)
    Iterable<Institution> findInstitutions(@Param("name")String name);

}
