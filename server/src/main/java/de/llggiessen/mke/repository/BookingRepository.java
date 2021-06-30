package de.llggiessen.mke.repository;

import de.llggiessen.mke.schema.Booking;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;

@Repository
@RepositoryRestResource(exported = false)
public interface BookingRepository extends CrudRepository<Booking, Long> {

    @Query(value = "SELECT * FROM booking WHERE booking.year LIKE %:year%", nativeQuery = true)
    Iterable<Booking> findAllByYear(@Param("year") String year);

    @Query(value = "SELECT * FROM booking WHERE booking.id LIKE %:id%", nativeQuery = true)
    Optional<Booking> findByID(@Param("id") long id);

    @Query(value = "SELECT * FROM booking WHERE booking.retrieval_date LIKE %:retrieval_date%", nativeQuery = true)
    Iterable<Booking> findAllByRetrievalBoatDate(@Param("retrieval_date") String retrieval_date);

    @Query(value = "SELECT * FROM booking WHERE booking.return_date LIKE %:return_date%", nativeQuery = true)
    Iterable<Booking> findAllByReturnBoatDate(@Param("return_date")Date return_date);

    @Query(value = "SELECT * FROM booking WHERE booking.status LIKE %:status%", nativeQuery = true)
    Iterable<Booking> findAllByStatus(@Param("status")char status);

}
