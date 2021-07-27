package de.llggiessen.mke.schema;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.springframework.security.core.GrantedAuthority;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Privilege implements GrantedAuthority {

    @Id
    private String id;

    @Override
    public String getAuthority() {
        return this.id;
    }

}
