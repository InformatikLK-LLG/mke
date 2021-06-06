package de.llggiessen.mke.schema;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Invite {

    @Id
    private String inviteCode;
    @Column(unique = true)
    private String email;
    @UpdateTimestamp
    @JsonProperty(access = Access.WRITE_ONLY)
    private LocalDateTime creationDate;

    public Invite(String email) {
        this.email = email;
    }

}