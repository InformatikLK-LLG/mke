package de.llggiessen.mke.repository;

import de.llggiessen.mke.schema.Booking;
import de.llggiessen.mke.schema.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public interface bookingRepository extends CrudRepository<Booking, Long> {

}
