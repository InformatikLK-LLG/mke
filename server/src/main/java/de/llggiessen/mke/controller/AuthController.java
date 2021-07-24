package de.llggiessen.mke.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.User;
import de.llggiessen.mke.schema.UserCredentials;
import de.llggiessen.mke.security.JwtTokenUtil;

@RestController
public class AuthController {

    @Autowired
    private UserRepository repository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody UserCredentials userCredentials, HttpServletResponse response) {
        User user = repository.findExactByEmail(userCredentials.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if (passwordEncoder.matches(userCredentials.getPassword(), user.getPassword())) {
            String accessToken = jwtTokenUtil.generateAccessToken(user);
            Cookie cookie = new Cookie("auth", accessToken);

            cookie.setSecure(true);
            cookie.setHttpOnly(true);
            cookie.setMaxAge(7 * 24 * 60 * 60);
            cookie.setPath("/");
            response.addCookie(cookie);
            return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken).body(user);
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }
}