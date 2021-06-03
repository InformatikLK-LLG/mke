package de.llggiessen.mke;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.User;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserRepository repository;

    static Logger log = LoggerFactory.getLogger(DatabaseLoader.class);

    @Autowired
    public DatabaseLoader(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) throws Exception {
        try {
            this.repository.save(new User("Super", "Admin", "mail@mail.com", "password"));
        } catch (Exception e) {
            log.info("Super admin already exists.");
        }
    }
}
