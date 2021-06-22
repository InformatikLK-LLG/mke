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

    @Query(value = "SELECT * FROM institution WHERE institution.inst_code = :instCode", nativeQuery = true)
    Institution findInstitutionByID(@Param("instCode") String instCode);

    @Query(value = "SELECT * FROM institution WHERE institution.svb = :svb", nativeQuery = true)
    Iterable<Institution> findInstitutionsBySvb(@Param("svb") boolean svb);

    @Query(value = "SELECT * FROM institution WHERE institution.name LIKE %:name% AND institution.street LIKE %:street%", nativeQuery = true)
    Iterable<Institution> findInstitutions(@Param("name")String name,@Param("street") String street);

}
