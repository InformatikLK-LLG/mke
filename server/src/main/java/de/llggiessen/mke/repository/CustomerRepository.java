package de.llggiessen.mke.repository;

import de.llggiessen.mke.schema.Customer;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
@Transactional
public interface CustomerRepository extends CrudRepository<Customer, Long> {

    @Modifying
    @Query("DELETE Customer customer WHERE customer.email = :email")
    void deleteByEmail(@Param("email") String email);

    Optional<Customer> findByEmail(String email);

    @Query("SELECT customer FROM Customer customer WHERE customer.email LIKE %:email% AND customer.firstName LIKE %:firstName% AND customer.lastName LIKE %:lastName%")
    Iterable<Customer> findAllByAttributes(@Param("email") String email, @Param("firstName") String firstName,
            @Param("lastName") String lastName);

    @Query("SELECT customer FROM Customer customer WHERE customer.mobilePhone LIKE %:mobilePhone%")
    Iterable<Customer> findAllByMobilePhone(@Param("mobilePhone") String mobilePhone);

    @Query("SELECT customer FROM Customer customer WHERE customer.businessPhone LIKE %:businessPhone%")
    Iterable<Customer> findAllByBusinessPhone(@Param("businessPhone") String businessPhone);

}