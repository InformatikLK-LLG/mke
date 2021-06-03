package de.llggiessen.mke.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.User;

import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping(path = "/user")
public class UserController {

    @Autowired
    UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("")
    public Iterable<User> getUsers(@RequestParam(value = "email", required = false, defaultValue = "") String email,
            @RequestParam(value = "firstName", required = false, defaultValue = "") String firstName,
            @RequestParam(value = "lastName", required = false, defaultValue = "") String lastName) {

        return repository.findAllByAttributes(email, firstName, lastName);
    }

    @DeleteMapping("")
    public User deleteByEmail(@RequestParam(value = "email") String email) {
        return repository.deleteByEmail(email);
    }

    @PostMapping("")
    public User createUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getFirstName() == null || user.getLastName() == null
                || user.getPassword() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            return repository.save(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

}
