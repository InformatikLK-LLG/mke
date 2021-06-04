package de.llggiessen.mke.schema;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Invite {

    @Id
    private int inviteCode;
    @Column(unique = true)
    private String email;
    @UpdateTimestamp
    private Date creationDate;

    public Invite(String email) {
        this.email = email;
    }

}