package de.llggiessen.mke.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import de.llggiessen.mke.repository.RefreshTokenRepository;
import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.RefreshToken;
import de.llggiessen.mke.schema.User;
import de.llggiessen.mke.schema.UserCredentials;
import de.llggiessen.mke.security.JwtTokenUtil;

@RestController
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody UserCredentials userCredentials, HttpServletResponse response) {
        User user = userRepository.findExactByEmail(userCredentials.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if (passwordEncoder.matches(userCredentials.getPassword(), user.getPassword())) {
            String accessToken = jwtTokenUtil.generateAccessToken(user);
            String refreshToken = createRefreshToken(user).getToken();

            Cookie cookie = new Cookie("auth", accessToken);
            cookie.setSecure(true);
            cookie.setHttpOnly(true);
            cookie.setMaxAge(5 * 60);
            cookie.setPath("/");

            Cookie refreshCookie = new Cookie("refresh", refreshToken);
            refreshCookie.setSecure(true);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setMaxAge(7 * 24 * 60 * 60);
            refreshCookie.setPath("/");

            response.addCookie(cookie);
            response.addCookie(refreshCookie);

            return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken).body(user);
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public boolean isExpired(RefreshToken token) {
        long expirationTimeZeugs = 1000 * 60 * 60 * 24 * 7;
        return ((token.getIssuedAt().getTime() + expirationTimeZeugs) > new Date().getTime());
    }

    public RefreshToken handleExpiration(RefreshToken token) {
        if (isExpired(token)) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),
                    "Refresh token was expired. Please make a new login request.");
        }
        return token;
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    private class TokenRefreshException extends RuntimeException {

        public TokenRefreshException(String token, String message) {
            super(String.format("Failed for [%s]: %s", token, message));
        }
    }
}