package de.llggiessen.mke;

import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import de.llggiessen.mke.repository.PrivilegeRepository;
import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.Privilege;
import de.llggiessen.mke.schema.Role;
import de.llggiessen.mke.schema.User;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PrivilegeRepository privilegeRepository;

    static Logger log = LoggerFactory.getLogger(DatabaseLoader.class);

    @Autowired
    public DatabaseLoader(UserRepository userRepository, PasswordEncoder passwordEncoder,
            PrivilegeRepository privilegeRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.privilegeRepository = privilegeRepository;
    }

    @Override
    public void run(String... strings) throws Exception {
        String password = passwordEncoder.encode("password");
        createUserIfNotFound("Super", "Admin", "mail@mail.com", password);

        createPrivilegeIfNotFound("INSTITUTION_READ").toString();
        createPrivilegeIfNotFound("INSTITUTION_WRITE").toString();

    }

    public Privilege createPrivilegeIfNotFound(String name) {
        Optional<Privilege> privilege = privilegeRepository.findById(name);
        if (privilege.isPresent())
            return privilege.get();
        return privilegeRepository.save(new Privilege(name));
    }

    public User createUserIfNotFound(String firstName, String lastName, String email, String password) {
        Optional<User> user = userRepository.findExactByEmail(email);
        if (user.isPresent()) {
            return user.get();
        }
        return userRepository.save(new User(firstName, lastName, email, password));
    }

}
