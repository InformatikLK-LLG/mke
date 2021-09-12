package de.llggiessen.mke.schema;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import org.springframework.security.core.GrantedAuthority;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue
    private long id;
    @Column(unique = true)
    private String name;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Privilege> privileges;

    public String getAuthority() {
        return "ROLE_" + this.name;
    }

    public Role(String name, Set<Privilege> privileges) {
        this.name = name;
        this.privileges = privileges;
    }

}