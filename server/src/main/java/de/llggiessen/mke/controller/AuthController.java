package de.llggiessen.mke.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.User;
import de.llggiessen.mke.schema.UserCredentials;

@RestController
public class AuthController {

    @Autowired
    UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public User loginUser(@RequestBody UserCredentials userCredentials) {
        User user = repository.findExactByEmail(userCredentials.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if (passwordEncoder.matches(userCredentials.getPassword(), user.getPassword()))
            return user;

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }
}