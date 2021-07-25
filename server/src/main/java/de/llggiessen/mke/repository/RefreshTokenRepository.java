package de.llggiessen.mke.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import de.llggiessen.mke.schema.RefreshToken;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    @Query(value = "DELETE FROM refresh_token WHERE user_id = :userId", nativeQuery = true)
    void deleteByUserId(@Param("userId") long userId);

    @Query(value = "DELETE FROM refresh_token where token = :token", nativeQuery = true)
    void deleteByToken(@Param("token") String token);
}
