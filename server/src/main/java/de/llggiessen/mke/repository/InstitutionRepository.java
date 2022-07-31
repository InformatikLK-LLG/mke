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

    @Query("SELECT institution FROM Institution institution WHERE institution.name LIKE %:name%")
    Iterable<Institution> findInstitutions(@Param("name") String name);

    @Query("SELECT institution FROM Institution institution WHERE institution.name LIKE %:name% AND institution.id LIKE %:id% AND institution.address.street LIKE %:street%")
    Iterable<Institution> findInstitutionsByAttributes(@Param("name") String name, @Param("id") String id,
            @Param("street") String street);

    @Query("SELECT institution FROM Institution institution WHERE institution.name LIKE %:name% AND institution.id LIKE %:id% AND institution.schoolAdministrativeDistrict = :svb AND institution.address.street LIKE %:street%")
    Iterable<Institution> filterInstitutions(@Param("name") String name, @Param("id") String id,
            @Param("svb") boolean svb, @Param("street") String street);
}
