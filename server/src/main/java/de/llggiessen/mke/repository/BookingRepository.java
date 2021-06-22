package de.llggiessen.mke.repository;

import de.llggiessen.mke.schema.Booking;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public interface BookingRepository extends CrudRepository<Booking, Long> {

    @Query(value = "SELECT * FROM booking WHERE booking.year LIKE %:year%", nativeQuery = true)
    Iterable<Booking> findAllByAttributes(@Param("year") String year);
}
