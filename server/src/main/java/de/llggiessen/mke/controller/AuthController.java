package de.llggiessen.mke.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.User;
import de.llggiessen.mke.schema.UserCredentials;
import de.llggiessen.mke.security.JwtTokenUtil;
import de.llggiessen.mke.security.RefreshTokenUtil;

@RestController
public class AuthController {

    private UserRepository userRepository;
    private JwtTokenUtil jwtTokenUtil;
    private PasswordEncoder passwordEncoder;
    private RefreshTokenUtil refreshTokenUtil;

    @Autowired
    public AuthController(UserRepository userRepository, JwtTokenUtil jwtTokenUtil, PasswordEncoder passwordEncoder,
            RefreshTokenUtil refreshTokenUtil) {
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenUtil = refreshTokenUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody UserCredentials userCredentials, HttpServletResponse response) {
        User user = userRepository.findExactByEmail(userCredentials.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credentials are bad."));

        if (passwordEncoder.matches(userCredentials.getPassword(), user.getPassword())) {
            String accessToken = jwtTokenUtil.generateAccessToken(user);
            String refreshToken = refreshTokenUtil.createRefreshToken(user).getToken();

            Cookie cookie = new Cookie("auth", accessToken);
            // cookie.setSecure(true);
            cookie.setHttpOnly(true);
            cookie.setMaxAge(5 * 60);
            cookie.setPath("/");

            Cookie refreshCookie = new Cookie("refresh", refreshToken);
            // refreshCookie.setSecure(true);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setMaxAge(7 * 24 * 60 * 60);
            refreshCookie.setPath("/profile");

            response.addCookie(cookie);
            response.addCookie(refreshCookie);

            return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken).body(user);
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credentials are bad.");
    }

    @PostMapping("/signin")
    public User signInUser(HttpServletRequest request) {
        if (request.getCookies() == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals("auth") && jwtTokenUtil.validate(cookie.getValue())) {
                return userRepository.findById(jwtTokenUtil.getUserId(cookie.getValue()))
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    @DeleteMapping("/profile/logout")
    public void logoutUser(HttpServletRequest request, HttpServletResponse response) {
        if (request.getCookies() == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        for (Cookie cookie : request.getCookies())
            if (cookie.getName().equals("refresh") && refreshTokenUtil.validate(cookie.getValue())) {
                refreshTokenUtil.revokeToken(cookie.getValue());

                Cookie newCookie = new Cookie("auth", "");
                // cookie.setSecure(true);
                newCookie.setHttpOnly(true);
                newCookie.setMaxAge(0);
                newCookie.setPath("/");

                Cookie refreshCookie = new Cookie("refresh", "");
                // refreshCookie.setSecure(true);
                refreshCookie.setHttpOnly(true);
                refreshCookie.setMaxAge(0);
                refreshCookie.setPath("/profile");

                response.addCookie(newCookie);
                response.addCookie(refreshCookie);
                return;
            }
    }

    @DeleteMapping("/profile/revokeAll")
    public void revokeAllSessions(HttpServletRequest request, HttpServletResponse response) {
        if (request.getCookies() == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        for (Cookie cookie : request.getCookies())
            if (cookie.getName().equals("auth") && jwtTokenUtil.validate(cookie.getValue())) {
                refreshTokenUtil.revokeTokensOfUser(jwtTokenUtil.getUserId(cookie.getValue()));

                Cookie newCookie = new Cookie("auth", "");
                // cookie.setSecure(true);
                newCookie.setHttpOnly(true);
                newCookie.setMaxAge(0);
                newCookie.setPath("/");

                Cookie refreshCookie = new Cookie("refresh", "");
                // refreshCookie.setSecure(true);
                refreshCookie.setHttpOnly(true);
                refreshCookie.setMaxAge(0);
                refreshCookie.setPath("/profile");

                response.addCookie(newCookie);
                response.addCookie(refreshCookie);
                return;
            }
    }

    @PostMapping("/profile/refreshToken")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {

        if (request.getCookies() != null)
            for (Cookie cookie : request.getCookies())
                if ((cookie.getName().equals("refresh")) && refreshTokenUtil.validate(cookie.getValue())) {
                    User user = refreshTokenUtil.getUser(cookie.getValue());
                    String accessToken = jwtTokenUtil.generateAccessToken(user);

                    Cookie newCookie = new Cookie("auth", accessToken);
                    // newCookie.setSecure(true);
                    newCookie.setHttpOnly(true);
                    newCookie.setMaxAge(5 * 60);
                    newCookie.setPath("/");

                    response.addCookie(newCookie);
                    return;
                }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

}
