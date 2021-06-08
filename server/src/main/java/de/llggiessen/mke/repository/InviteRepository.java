package de.llggiessen.mke.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import de.llggiessen.mke.schema.Invite;

@Repository
@RepositoryRestResource(exported = false)
public interface InviteRepository extends CrudRepository<Invite, String> {

    @Query(value = "SELECT * FROM invite WHERE invite.email = :email", nativeQuery = true)
    Optional<Invite> findByEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM invite WHERE invite.invite_code = :code AND invite.email = :email", nativeQuery = true)
    Optional<Invite> findByAttributes(@Param("code") String code, @Param("email") String email);

    @Query(value = "SELECT * FROM invite WHERE invite.encoded_invite_code = :code", nativeQuery = true)
    Optional<Invite> findByEncodedInviteCode(@Param("code") String code);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM invite WHERE invite.email = :email", nativeQuery = true)
    void deleteByEmail(@Param("email") String email);
}
