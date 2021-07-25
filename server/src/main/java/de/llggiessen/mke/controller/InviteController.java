package de.llggiessen.mke.controller;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.mail.internet.InternetAddress;

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

import de.llggiessen.mke.mail.EmailService;
import de.llggiessen.mke.mail.Mail;
import de.llggiessen.mke.repository.InviteRepository;
import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.Invite;
import de.llggiessen.mke.schema.InviteRequestModel;
import de.llggiessen.mke.schema.User;

@RestController
@RequestMapping(path = "/invite")
public class InviteController {

    @Autowired
    InviteRepository inviteRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailService emailService;

    @Autowired
    private org.springframework.core.env.Environment env;

    static final Logger log = LoggerFactory.getLogger(InviteController.class);

    @GetMapping("")
    public Iterable<Invite> getInvites() {
        return inviteRepository.findAll();
    }

    @GetMapping(value = "", params = { "code", "email" })
    public Invite isInvite(@RequestParam String code, @RequestParam String email) {
        for (Invite invite : inviteRepository.findAll()) {
            if (passwordEncoder.matches(code + email, invite.getEncodedInviteCode()))
                return invite;
        }
        return null;
    }

    @GetMapping(value = "", params = { "inviteCode" })
    public Invite isInvite(@RequestParam String inviteCode) {
        try {
            return inviteRepository.findByEncodedInviteCode(new String(Base64.decodeBase64(inviteCode))).orElse(null);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("")
    public Invite createInvite(@RequestBody InviteRequestModel inviteRequest) {
        if (userRepository.findExactByEmail(inviteRequest.getEmail()).isPresent())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email already exists");

        Invite invite = new Invite();

        while (true) {
            // extend expiration time (by updating invite) if invite already exists
            Optional<Invite> inviteFromDb = inviteRepository
                    .findById(inviteRequest.getInviteCode() == null ? "" : inviteRequest.getInviteCode());
            if (inviteFromDb.isPresent()) {
                invite.setEmail(inviteFromDb.get().getEmail());
                invite.setInviteCode(inviteRequest.getInviteCode());
            } else {
                SecureRandom random = new SecureRandom();

                // inviteCode should be six digits long and always positive
                int inviteCode = 100000 + (random.nextInt() % 900000 + 900000) % 900000;

                User user = userRepository.findExactByEmail(inviteRequest.getEmail())
                        .orElse(userRepository.save(new User(inviteRequest.getEmail(), inviteRequest.getRoles())));

                invite.setUser(user);
                invite.setInviteCode(String.valueOf(inviteCode));

                String encodedInviteCode = passwordEncoder.encode(String.valueOf(inviteCode) + invite.getEmail());
                if (!inviteRepository.findByEncodedInviteCode(encodedInviteCode).isPresent()) {
                    invite.setEncodedInviteCode(encodedInviteCode);
                }
            }

            try {
                Invite finalInvite = inviteRepository.save(invite);
                String link = String.format("http://localhost:3000/register?inviteCode=%s",
                        new String(Base64.encodeBase64(finalInvite.getEncodedInviteCode().getBytes())));

                Mail mail = new Mail();

                mail.setFrom(new InternetAddress(env.getProperty("invite.mail.from.email"),
                        env.getProperty("invite.mail.from.name")));
                mail.setTo(finalInvite.getEmail());
                mail.setSubject("Du wurdest eingeladen :)");

                Map<String, Object> model = new HashMap<>();
                model.put("link", link);
                model.put("code", finalInvite.getInviteCode());
                mail.setProps(model);

                emailService.sendFancyEmail(mail);

                return finalInvite;
            } catch (Exception e) {
                if (e.getCause().getClass().equals(ConstraintViolationException.class)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email already invited");
                }
                if (e.getCause().getClass().equals(IdentifierGenerationException.class)) {
                    log.info("inviteCode already in use. Retrying.");
                } else {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
                }
            }
        }

    }
}