package de.llggiessen.mke.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import de.llggiessen.mke.schema.Invite;

@Repository
@RepositoryRestResource(exported = false)
@Transactional
public interface InviteRepository extends CrudRepository<Invite, Long> {

    @Query("SELECT invite FROM Invite invite WHERE invite.user.email = :email")
    Optional<Invite> findByEmail(@Param("email") String email);

    @Query("SELECT invite FROM Invite invite WHERE invite.inviteCode = :code AND invite.user.email = :email")
    Optional<Invite> findByAttributes(@Param("code") String code, @Param("email") String email);

    @Query("SELECT invite FROM Invite invite WHERE invite.encodedInviteCode = :code")
    Optional<Invite> findByEncodedInviteCode(@Param("code") String code);

    void deleteByUserEmail(@Param("email") String email);

    Optional<Invite> findByInviteCode(String inviteCode);

}
