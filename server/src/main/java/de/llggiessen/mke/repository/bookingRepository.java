package de.llggiessen.mke.repository;

import de.llggiessen.mke.schema.Booking;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public interface bookingRepository extends CrudRepository<Booking, Long> {

}
