package de.llggiessen.mke.controller;

import java.security.SecureRandom;
import java.util.Optional;

import org.apache.tomcat.util.codec.binary.Base64;
import org.hibernate.exception.ConstraintViolationException;
import org.hibernate.id.IdentifierGenerationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import de.llggiessen.mke.repository.InviteRepository;
import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.Invite;

@RestController
@RequestMapping(path = "/invite")
public class InviteController {

    @Autowired
    InviteRepository inviteRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    static final Logger log = LoggerFactory.getLogger(InviteController.class);

    @GetMapping("")
    public Iterable<Invite> getInvites() {
        return inviteRepository.findAll();
    }

    @GetMapping(value = "", params = { "code", "email" })
    public Invite isInvite(@RequestParam String code, @RequestParam String email) {
        for (Invite invite : inviteRepository.findAll()) {
            if (passwordEncoder.matches(code + email, invite.getInviteCode()))
                return invite;
        }
        return null;
    }

    @GetMapping(value = "", params = { "inviteCode" })
    public Invite isInvite(@RequestParam String inviteCode) {
        try {
            return inviteRepository.findById(new String(Base64.decodeBase64(inviteCode))).orElse(null);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("")
    public Invite createInvite(@RequestBody Invite invite) {
        if (userRepository.findExactByEmail(invite.getEmail()).isPresent())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email already exists");

        while (true) {
            Optional<Invite> inviteFromDb = inviteRepository
                    .findById(invite.getInviteCode() == null ? "" : invite.getInviteCode());
            if (inviteFromDb.isPresent()) {
                invite.setEmail(inviteFromDb.get().getEmail());
            } else {
                // generate invite code
                // do some modulo and add it to 100.000 such that it is always in range. in
                // addition, multiply the modulo thing with email hash for extra security
                SecureRandom random = new SecureRandom();

                // inviteCode should be six digits long and always positive
                int inviteCode = 100000 + (random.nextInt() % 900000 + 900000) % 900000;

                log.info(String.valueOf(inviteCode));
                String encodedInviteCode = passwordEncoder.encode(String.valueOf(inviteCode) + invite.getEmail());
                if (!inviteRepository.findById(encodedInviteCode).isPresent())
                    invite.setInviteCode(encodedInviteCode);
            }

            try {
                Invite finalInvite = inviteRepository.save(invite);
                log.info("http://localhost:3000/register?inviteCode={}",
                        new String(Base64.encodeBase64(finalInvite.getInviteCode().getBytes())));
                return finalInvite;
            } catch (Exception e) {
                if (e.getCause().getClass().equals(ConstraintViolationException.class))
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email already invited");
                if (e.getCause().getClass().equals(IdentifierGenerationException.class))
                    log.info("inviteCode already in use. Retrying.");
            }
        }

    }
}
