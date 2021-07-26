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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import de.llggiessen.mke.repository.InviteRepository;
import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.User;

@RestController
@RequestMapping(path = "/user")
public class UserController {

    private UserRepository userRepository;
    private InviteRepository inviteRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserRepository userRepository, InviteRepository inviteRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.inviteRepository = inviteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    static final Logger log = LoggerFactory.getLogger(UserController.class);

    @GetMapping("")
    public Iterable<User> getUsers(@RequestParam(value = "email", required = false, defaultValue = "") String email,
            @RequestParam(value = "firstName", required = false, defaultValue = "") String firstName,
            @RequestParam(value = "lastName", required = false, defaultValue = "") String lastName) {

        return userRepository.findAllByAttributes(email, firstName, lastName);
    }

    @DeleteMapping("")
    public void deleteByEmail(@RequestParam(value = "email") String email) {
        userRepository.deleteByEmail(email);
    }

    @PostMapping("")
    public User createUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getFirstName() == null || user.getLastName() == null
                || user.getPassword() == null || !inviteRepository.findByEmail(user.getEmail()).isPresent())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            inviteRepository.deleteByEmail(user.getEmail());
            return userRepository.save(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

}
