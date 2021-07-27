package de.llggiessen.mke.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.Privilege;
import de.llggiessen.mke.schema.Role;
import de.llggiessen.mke.schema.User;

import java.util.HashSet;
import java.util.Set;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {
    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;

    @Autowired
    public JwtTokenFilter(JwtTokenUtil jwtTokenUtil, UserRepository userRepository) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        final Cookie[] cookies = request.getCookies();

        if (cookies == null || cookies.length == 0) {
            chain.doFilter(request, response);
            return;
        }

        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("auth")) {
                String token = cookie.getValue();
                User userDetails = userRepository.findById(jwtTokenUtil.getUserId(token)).orElse(null);

                Set<Privilege> privileges = new HashSet<>();

                for (Role role : userDetails.getRoles()) {
                    privileges.addAll(role.getPrivileges());
                }

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails == null ? Set.of() : privileges);

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                chain.doFilter(request, response);
                return;
            }
        }

        chain.doFilter(request, response);

    }
}