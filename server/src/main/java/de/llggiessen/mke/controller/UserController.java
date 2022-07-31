package de.llggiessen.mke.controller;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import de.llggiessen.mke.repository.RefreshTokenRepository;
import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.Privilege;
import de.llggiessen.mke.schema.Role;
import de.llggiessen.mke.schema.User;
import de.llggiessen.mke.utils.FormValidation;
import de.llggiessen.mke.utils.RoleUtils;

@RestController
@RequestMapping(path = "/user")
public class UserController {

    private UserRepository userRepository;
    private RefreshTokenRepository refreshTokenRepository;
    private RoleUtils roleUtils;

    @Autowired
    public UserController(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository,
            RoleUtils roleUtils) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.roleUtils = roleUtils;
    }

    static final Logger log = LoggerFactory.getLogger(UserController.class);

    @GetMapping("")
    @PreAuthorize("hasAuthority('USER_READ')")
    public Iterable<User> getUsers(@RequestParam(value = "email", defaultValue = "") String email,
            @RequestParam(value = "firstName", defaultValue = "") String firstName,
            @RequestParam(value = "lastName", defaultValue = "") String lastName,
            @RequestParam(value = "roles", defaultValue = "") String roles) {

        Set<String> rolesSet = Set.of(roles.split(","));

        return roles.equals("")
                ? userRepository.findDistinctByEmailContainingAndFirstNameContainingAndLastNameContaining(email,
                        firstName, lastName)
                : userRepository.findDistinctByEmailContainingAndFirstNameContainingAndLastNameContainingAndRolesIdIn(
                        email, firstName, lastName, rolesSet);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public User getUser(@PathVariable long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST));
    }

    @GetMapping("/{userId}/privileges")
    public Iterable<Privilege> getPrivileges(@PathVariable long userId) {
        Set<Privilege> privileges = new HashSet<>();
        Set<Role> roles = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No user with this id."))
                .getRoles();
        roles.forEach((role) -> privileges.addAll(role.getPrivileges()));
        return privileges;
    }

    @DeleteMapping("")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public void deleteByEmail(@RequestParam(value = "email") String email) {
        User user = userRepository.findExactByEmail(email).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not find user with this email."));
        refreshTokenRepository.deleteByUserId(user.getId());
        userRepository.deleteById(user.getId());
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public User updateUser(@PathVariable long userId, @RequestBody User user) {
        Optional<User> userFromDb = userRepository.findById(userId);

        if (!userFromDb.isPresent())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "There is no customer with this id. Maybe you meant to create a new customer using a POST request.");
        FormValidation.validateUser(user);
        try {
            user.setPassword(userFromDb.get().getPassword());
            return userRepository.save(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not update customer.");
        }
    }

    @PutMapping("/{userId}/role")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public User setRoles(@PathVariable long userId, @RequestBody Set<Role> roles,
            @RequestParam(value = "shouldOverride", defaultValue = "true") boolean shouldOverride) {

        boolean isInUsersScope = true;
        boolean isValid = true;

        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "There is no user with this id."));

        for (Role role : roles) {
            if (!roleUtils.isPresent(role)) {
                isValid = false;
                break;
            }

            if (!roleUtils.isInUsersScope(role.getId())) {
                isInUsersScope = false;
                break;
            }
        }

        if (!isInUsersScope)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "You are not allowed to assign privileges you do not have yourself.");

        if (!isValid)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not a valid set of roles.");

        if (shouldOverride) {
            user.setRoles(roles);
        } else {
            Set<Role> newRoles = user.getRoles();
            newRoles.addAll(roles);
            user.setRoles(newRoles);
        }

        return userRepository.save(user);
    }

    @DeleteMapping("/{userId}/role")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public void revokeRole(@PathVariable long userId, @RequestParam("roleId") long roleId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No user with this id."));

        if (!roleUtils.isInUsersScope(roleId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "You are not allowed to manage privileges you do not have yourself");

        if (!user.getRoles().removeIf((role) -> role.getId() == roleId))
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "User has no role with this id");

        userRepository.save(user);
    }

}
