package de.llggiessen.mke.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.User;
import de.llggiessen.mke.schema.UserCredentials;

@RestController
public class AuthController {

    @Autowired
    UserRepository repository;

    @PostMapping("/login")
    public User loginUser(@RequestBody UserCredentials userCredentials) {
        User user = repository.findExactByEmail(userCredentials.getEmail());

        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        if (user.getPassword().equals(userCredentials.getPassword()))
            return user;

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }
}