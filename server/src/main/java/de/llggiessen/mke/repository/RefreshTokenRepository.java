package de.llggiessen.mke.repository;

import org.springframework.data.repository.CrudRepository;

import de.llggiessen.mke.schema.RefreshToken;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, Long> {

}
