package de.llggiessen.mke.repository;

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
    Iterable<Institution> findInstitutions(@Param("name") String name);

    @Query(value = "SELECT * FROM institution WHERE institution.name LIKE %:name% AND institution.id LIKE %:id%", nativeQuery = true)
    Iterable<Institution> findInstitutionsByAttributes(@Param("name") String name, @Param("id") String id);

    @Query(value = "SELECT * FROM institution WHERE institution.name LIKE %:name% AND institution.id LIKE %:id% AND institution.school_administrative_district = :svb", nativeQuery = true)
    Iterable<Institution> filterInstitutions(@Param("name") String name, @Param("id") String id,
            @Param("svb") boolean svb);
}