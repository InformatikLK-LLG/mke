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
import de.llggiessen.mke.repository.RoleRepository;
import de.llggiessen.mke.repository.UserRepository;
import de.llggiessen.mke.schema.Privilege;
import de.llggiessen.mke.schema.Role;
import de.llggiessen.mke.schema.User;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PrivilegeRepository privilegeRepository;
    private final RoleRepository roleRepository;

    static Logger log = LoggerFactory.getLogger(DatabaseLoader.class);

    @Autowired
    public DatabaseLoader(UserRepository userRepository, PasswordEncoder passwordEncoder,
            PrivilegeRepository privilegeRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.privilegeRepository = privilegeRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... strings) throws Exception {
        String password = passwordEncoder.encode("password");

        Privilege instRead = createPrivilegeIfNotFound("INSTITUTION_READ");
        Privilege instWrite = createPrivilegeIfNotFound("INSTITUTION_WRITE");
        Role admin = createRoleIfNotFound("ADMIN", Set.of(instRead, instWrite));
        log.info(Set.of(instRead, instWrite).toString());
        log.info(admin.toString());

        createUserIfNotFound("Super", "Admin", "mail@mail.com", password, Set.of(admin));

    }

    public Role createRoleIfNotFound(String name, Set<Privilege> privileges) {
        Optional<Role> role = roleRepository.findById(name);
        if (role.isPresent())
            return role.get();
        return roleRepository.save(new Role(name, privileges));
    }

    public Privilege createPrivilegeIfNotFound(String name) {
        Optional<Privilege> privilege = privilegeRepository.findById(name);
        if (privilege.isPresent())
            return privilege.get();
        return privilegeRepository.save(new Privilege(name));
    }

    public User createUserIfNotFound(String firstName, String lastName, String email, String password) {
        Optional<User> user = userRepository.findExactByEmail(email);
        if (user.isPresent())
            return user.get();
        return userRepository.save(new User(firstName, lastName, email, password));
    }

    public User createUserIfNotFound(String firstName, String lastName, String email, String password,
            Set<Role> roles) {
        Optional<User> user = userRepository.findExactByEmail(email);
        if (user.isPresent())
            return user.get();
        return userRepository.save(new User(firstName, lastName, email, password, roles));
    }
}
