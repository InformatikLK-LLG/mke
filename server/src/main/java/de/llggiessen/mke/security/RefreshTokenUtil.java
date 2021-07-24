package de.llggiessen.mke.security;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import de.llggiessen.mke.repository.RefreshTokenRepository;
import de.llggiessen.mke.schema.RefreshToken;
import de.llggiessen.mke.schema.User;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RefreshTokenUtil {

    @Autowired
    RefreshTokenRepository refreshTokenRepository;

    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken(user, UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public boolean isExpired(RefreshToken token) {
        long expirationTimeZeugs = 1000 * 60 * 60 * 24 * 7;
        return ((token.getIssuedAt().getTime() + expirationTimeZeugs) < new Date().getTime());
    }

    public RefreshToken handleExpiration(RefreshToken token) {
        if (isExpired(token)) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),
                    "Refresh token was expired. Please make a new login request.");
        }
        return token;
    }

    public boolean validate(String token) {
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByToken(token);

        if (refreshToken.isPresent()) {
            try {
                handleExpiration(refreshToken.get());
                return true;
            } catch (Exception e) {
                throw e;
            }
        }
        return false;
    }

    public User getUser(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED)).getUser();
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    private class TokenRefreshException extends RuntimeException {

        public TokenRefreshException(String token, String message) {
            super(String.format("Failed for [%s]: %s", token, message));
        }
    }

}