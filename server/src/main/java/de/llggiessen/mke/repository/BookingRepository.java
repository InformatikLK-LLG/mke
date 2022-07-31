package de.llggiessen.mke.repository;

import de.llggiessen.mke.schema.Booking;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;

import javax.transaction.Transactional;

@Repository
@RepositoryRestResource(exported = false)
@Transactional
public interface BookingRepository extends CrudRepository<Booking, Long> {

    Iterable<Booking> findAllByYear(String year);

    Optional<Booking> findById(long id);

    @Query(value = "SELECT * FROM booking WHERE booking.retrieval_date LIKE %:retrievalDate%", nativeQuery = true)
    Iterable<Booking> findAllByRetrievalBoatDate(@Param("retrievalDate") String retrievalDate);

    @Query(value = "SELECT * FROM booking WHERE booking.return_date LIKE %:returnDate%", nativeQuery = true)
    Iterable<Booking> findAllByReturnBoatDate(@Param("returnDate") String returnDate);

    @Query(value = "SELECT * FROM booking WHERE booking.status LIKE %:status%", nativeQuery = true)
    Iterable<Booking> findAllByStatus(@Param("status") char status);

    @Query(value = "SELECT * FROM booking WHERE booking.retrieval_date BETWEEN :retrievalDate AND :returnDate AND booking.return_date BETWEEN :retrievalDate AND :returnDate", nativeQuery = true)
    Iterable<Booking> findAllInRange(@Param("retrievalDate") Date retrievalDate, @Param("returnDate") Date returnDate);

    @Modifying
    @Query(value = "DELETE Booking booking WHERE booking.id = :id", nativeQuery = true)
    void deleteById(@Param("id") long id);
}
