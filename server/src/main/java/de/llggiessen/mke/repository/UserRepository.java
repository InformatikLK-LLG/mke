package de.llggiessen.mke.repository;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import de.llggiessen.mke.schema.User;

@Repository
@RepositoryRestResource(exported = false)
@Transactional
public interface UserRepository extends CrudRepository<User, Long> {

    @Query("SELECT user FROM User user WHERE user.email LIKE %:email%")
    Iterable<User> findAllByEmail(@Param("email") String email);

    @Query("SELECT user FROM User user WHERE user.email = :email")
    Optional<User> findExactByEmail(@Param("email") String email);

    @Query("SELECT user FROM User user WHERE user.firstName LIKE %:firstName%")
    Iterable<User> findAllByFirstName(@Param("firstName") String firstName);

    @Query("SELECT user FROM User user WHERE user.lastName LIKE %:lastName%")
    Iterable<User> findAllByLastName(@Param("lastName") String lastName);

    @Query("SELECT user FROM User user WHERE user.email LIKE %:email% AND user.firstName LIKE %:firstName% AND user.lastName LIKE %:lastName%")
    Iterable<User> findAllByAttributes(@Param("email") String email, @Param("firstName") String firstName,
            @Param("lastName") String lastName);
}