package de.llggiessen.mke.controller;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDateTime;

import javax.mail.internet.InternetAddress;

import org.apache.tomcat.util.codec.binary.Base64;
import org.hibernate.exception.ConstraintViolationException;
import org.hibernate.id.IdentifierGenerationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
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

    private InviteRepository inviteRepository;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private EmailService emailService;
    private Environment env;

    private static final Logger log = LoggerFactory.getLogger(InviteController.class);

    @Autowired
    public InviteController(InviteRepository inviteRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder, EmailService emailService, Environment env) {
        this.inviteRepository = inviteRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.env = env;
    }

    @GetMapping("")
    @PreAuthorize("hasAuthority('INVITE_READ')")
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

    @PutMapping("")
    @PreAuthorize("hasAuthority('INVITE_WRITE')")
    public Invite extendInvite(@RequestParam("inviteCode") String inviteCode) {
        Optional<Invite> invite = inviteRepository.findById(inviteCode);
        if (invite.isPresent()) {
            invite.get().setCreationDate(LocalDateTime.now());
            return inviteRepository.save(invite.get());
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No invite with this code.");
    }

    @PostMapping("")
    @PreAuthorize("hasAuthority('INVITE_WRITE')")
    public Invite createInvite(@RequestBody InviteRequestModel inviteRequest) {
        if (userRepository.findExactByEmail(inviteRequest.getEmail()).isPresent())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with this email already exists.");

        Invite invite = new Invite();

        while (true) {
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