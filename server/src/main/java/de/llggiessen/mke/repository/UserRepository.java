package de.llggiessen.mke.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import de.llggiessen.mke.schema.User;

@Repository
@RepositoryRestResource(exported = false)
public interface UserRepository extends CrudRepository<User, Long> {

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user WHERE user.email = :email", nativeQuery = true)
    void deleteByEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM user WHERE user.email LIKE %:email%", nativeQuery = true)
    Iterable<User> findAllByEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM user WHERE user.email = :email", nativeQuery = true)
    Optional<User> findExactByEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM user WHERE user.first_name LIKE %:firstName%", nativeQuery = true)
    Iterable<User> findAllByFirstName(@Param("firstName") String firstName);

    @Query(value = "SELECT * FROM user WHERE user.last_name LIKE %:lastName%", nativeQuery = true)
    Iterable<User> findAllByLastName(@Param("lastName") String lastName);

    @Query(value = "SELECT * FROM user WHERE user.email LIKE %:email% AND user.first_name LIKE %:firstName% AND user.last_name LIKE %:lastName%", nativeQuery = true)
    Iterable<User> findAllByAttributes(@Param("email") String email, @Param("firstName") String firstName,
            @Param("lastName") String lastName);
}