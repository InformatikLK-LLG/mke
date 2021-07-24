package de.llggiessen.mke.schema;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    private User user;

    @Column(unique = true)
    private String token;

    @Temporal(TemporalType.TIMESTAMP)
    private Date issuedAt;

    public RefreshToken(User user, String token) {
        this.user = user;
        this.token = token;
        this.issuedAt = new Date();
    }

}
