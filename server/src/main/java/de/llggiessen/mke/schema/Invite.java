package de.llggiessen.mke.schema;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.GeneratedValue;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import java.util.Set;

import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;

@Entity
@Data
public class Invite {

    @Id
    @GeneratedValue
    private long id;
    private String inviteCode;
    private String encodedInviteCode;
    @UpdateTimestamp
    @JsonProperty(access = Access.WRITE_ONLY)
    private LocalDateTime creationDate;

    @OneToOne
    private User user;

    public Invite() {
        this.user = new User();
    }

    public Invite(String email, Set<Role> roles) {
        this.user = new User(email, roles);
    }

    public String getEmail() {
        return this.user.getEmail();
    }

    public void setEmail(String email) {
        this.user.setEmail(email);
    }

}