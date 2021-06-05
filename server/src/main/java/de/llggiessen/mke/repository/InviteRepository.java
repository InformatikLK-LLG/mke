package de.llggiessen.mke.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import de.llggiessen.mke.schema.Invite;

@Repository
@RepositoryRestResource(exported = false)
public interface InviteRepository extends CrudRepository<Invite, String> {

    @Query(value = "SELECT * FROM invite WHERE invite.invite_code = :code AND invite.email = :email", nativeQuery = true)
    Optional<Invite> findByAttributes(@Param("code") String code, @Param("email") String email);

}
