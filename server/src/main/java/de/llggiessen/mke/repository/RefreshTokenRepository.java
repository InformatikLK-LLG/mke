package de.llggiessen.mke.repository;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import de.llggiessen.mke.schema.RefreshToken;

@Transactional
@Repository
@RepositoryRestResource(exported = false)
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    @Modifying
    @Query("DELETE RefreshToken refreshToken WHERE refreshToken.user.id = :userId")
    void deleteByUserId(@Param("userId") long userId);

    @Modifying
    @Query("DELETE RefreshToken refreshToken WHERE refreshToken.token = :token")
    void deleteByToken(@Param("token") String token);

}
