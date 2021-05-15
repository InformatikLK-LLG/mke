package de.llggiessen.mke;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping(path = "/user")
public class UserController {

    @Autowired
    UserRepository repository;

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
        try {
            return repository.save(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

}
