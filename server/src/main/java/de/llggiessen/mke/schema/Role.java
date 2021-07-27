package de.llggiessen.mke.schema;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
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
    private String id;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Privilege> privileges;

    public String getAuthority() {
        return "ROLE_" + this.id;
    }

}