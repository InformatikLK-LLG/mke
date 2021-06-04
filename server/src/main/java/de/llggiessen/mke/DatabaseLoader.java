package de.llggiessen.mke;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.User;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    static Logger log = LoggerFactory.getLogger(DatabaseLoader.class);

    @Autowired
    public DatabaseLoader(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... strings) throws Exception {
        try {
            String password = passwordEncoder.encode("password");
            this.repository.save(new User("Super", "Admin", "mail@mail.com", password));
        } catch (Exception e) {
            log.info("Super admin already exists.");
        }
    }
}
